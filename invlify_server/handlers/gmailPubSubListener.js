const { PubSub } = require('@google-cloud/pubsub')
const { google } = require('googleapis')
const axios = require('axios')
const { DateTime, Zone } = require('luxon')

const {
  getUserMetadata,
  getUser,
  getUserFromEmail,
  setUserMetadata,
  orderWithThreadIdExists,
  addOrderToUser,
} = require('./firestoreFunctions')
const {
  filterOrderEmail,
  ParseOrderDetails,
  ParseDeliveryDate,
  ParseCustomerName,
} = require('../utils/chatGPT')
const { generateGoogleRequestForAxios } = require('../utils/requestGenerators')
const {
  decodeBase64IntoUTF8,
  processMessageParts,
} = require('../utils/emailUtils')
const { consoleLogAndSendToAWS } = require('../utils/AWS')
const { domainToUse, pubSubSubscriptionToUse } = require('../constants')

const subscriptionNameOrId = pubSubSubscriptionToUse

const createGoogleOAuth2Client = (refreshToken) => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    `${domainToUse}/auth/google/callback`
  )

  oAuth2Client.setCredentials({ refresh_token: refreshToken })

  return oAuth2Client
}

// Pub/Sub.
const ACCOUNT_EMAIL_RECEIVED_HISTORY = {}

const pubSubClient = new PubSub()

const getMessageFromMessageId = async (
  emailAddress,
  messageId,
  gmailRefreshToken
) => {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${emailAddress}/messages/${messageId}`
    const oAuth2Client = createGoogleOAuth2Client(gmailRefreshToken)
    const { token } = await oAuth2Client.getAccessToken()
    const request = generateGoogleRequestForAxios(url, token)
    const response = await axios.request(request)
    return response.data.payload
  } catch (error) {
    throw error
  }
}

const parseEmail = async (email, products) => {
  const [isOrder, lines, deliveryDate] = await Promise.all([
    filterOrderEmail(email),
    ParseOrderDetails(email, products),
    ParseDeliveryDate(email),
  ])

  return [isOrder, lines, deliveryDate]
}

const handlePubSubEvent = async (
  emailAddress,
  historyId,
  user,
  gmailRefreshToken
) => {
  const _getAllHistoryEvents = async (historyId) => {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${emailAddress}/history?startHistoryId=${historyId}&labelId=${'INBOX'}`
    const oAuth2Client = createGoogleOAuth2Client(gmailRefreshToken)
    const { token } = await oAuth2Client.getAccessToken()
    const request = generateGoogleRequestForAxios(url, token)
    const response = await axios.request(request)

    // TODO: Handle pagination

    return response.data.history || []
  }

  const _filterHistoryEventsForReceivedEmails = (historyEvents) => {
    const messages = []

    for (const event of historyEvents) {
      if (
        event.messagesAdded &&
        event.messagesAdded[0]?.message?.labelIds?.includes?.('INBOX')
      ) {
        const message = event.messagesAdded[0].message
        messages.push(message)
      }
    }

    return messages
  }

  const _processReceivedEmails = async (receivedEmails) => {
    const _handleAddOrderToUser = async (
      emailAddress,
      { lines, deliveryDate },
      originalEmail,
      messageId,
      threadId
    ) => {
      const { customers, products } = user

      // Get customer ID.
      const customerName = await ParseCustomerName(
        user.customers,
        originalEmail
      )
      const customerReverseMap = Object.entries(customers).reduce(
        (acc, [id, { name }]) => {
          acc[name] = id
          return acc
        },
        {}
      )
      const customerId = customerReverseMap[customerName]

      if (!customerId) {
        consoleLogAndSendToAWS(
          `User (${emailAddress}). Skipping email ${messageId}. Customer name (${customerName}) not on list.`
        )
        return
      }

      // Get product IDs.
      const productReverseMap = Object.entries(products).reduce(
        (acc, [id, { name }]) => {
          acc[name] = id
          return acc
        },
        {}
      )
      const linesAsProductId = lines
        .map(({ product: productName, quantity }) => ({
          product: productReverseMap[productName],
          quantity,
        }))
        .filter((line) => line.product !== undefined)

      if (linesAsProductId.length === 0) {
        consoleLogAndSendToAWS(
          `User (${emailAddress}). Email ${messageId}. "linesAsProductId" is empty. Lines:
${JSON.stringify(lines, null, 2)}`
        )
      }

      consoleLogAndSendToAWS(`User (${emailAddress}). Email ${messageId}. About to add order:
${JSON.stringify(originalEmail, null, 2)}
`)

      await addOrderToUser(
        emailAddress,
        user.uid,
        customerId,
        linesAsProductId,
        deliveryDate,
        threadId
      )
    }

    try {
      for (const { id: messageId, threadId } of receivedEmails) {
        // To avoid processing same emails multiple times, which could happen
        // when you acknowledge many Pub/Sub events at once.
        if (!(emailAddress in ACCOUNT_EMAIL_RECEIVED_HISTORY)) {
          ACCOUNT_EMAIL_RECEIVED_HISTORY[emailAddress] = new Set()
        }
        if (ACCOUNT_EMAIL_RECEIVED_HISTORY[emailAddress].has(messageId)) {
          consoleLogAndSendToAWS(
            `User (${emailAddress}). Skipping email ${messageId}. We have processed this email already.`
          )
          continue
        }
        ACCOUNT_EMAIL_RECEIVED_HISTORY[emailAddress].add(messageId)

        // Don't parse an email if its thread has already been parsed.
        if (await orderWithThreadIdExists(user.uid, threadId)) {
          consoleLogAndSendToAWS(
            `User (${emailAddress}). Skipping email ${messageId}, threadID ${threadId}. We have processed this thread already.`
          )
          continue
        }

        consoleLogAndSendToAWS(
          `User (${emailAddress}). About to process email ${messageId}.`
        )

        const message = await getMessageFromMessageId(
          emailAddress,
          messageId,
          gmailRefreshToken
        )

        const { headers, parts } = message

        // Capture information we need.
        let title = ''
        let sender = ''
        let date = ''
        let emailContent = ''

        for (const { name, value } of headers) {
          switch (name) {
            case 'From': {
              sender = value
              continue
            }
            case 'Subject': {
              title = value
              continue
            }
            case 'Date': {
              luxonDate = DateTime.fromJSDate(new Date(value)).setZone('UTC-5') // Chicago
              date = luxonDate.toISODate()
              continue
            }
            default:
              continue
          }
        }

        emailContent = processMessageParts(parts)

        // If we could not find email content, maybe it is in "body." This is
        // the case for simple emails.
        if (!emailContent) {
          const { body } = message

          if (body.data) {
            emailContent = decodeBase64IntoUTF8(body.data || '')
          }
        }

        if (!title || !sender || !date || !emailContent) {
          consoleLogAndSendToAWS(
            `User (${emailAddress}). Skipping email ${messageId} from ${sender}. It is missing one or more fields.
  title: ${title}
  sender: ${sender}
  date: ${date}
  emailContent: ${emailContent}`
          )
          continue
        }

        // Process email with ChatGPT.
        const email = {
          title,
          sender,
          date,
          message: emailContent,
        }

        const [isOrder, lines, deliveryDate] = await parseEmail(
          email,
          user.products
        )

        // Write the order to DB if valid.
        if (isOrder === 'yes') {
          const linesAsJSON = JSON.parse(lines)
          const deliveryDateAsDateObj = new Date(`${deliveryDate}T12:00:00`) // Use 12pm to ensure no timezone issues.

          await _handleAddOrderToUser(
            emailAddress,
            { lines: linesAsJSON, deliveryDate: deliveryDateAsDateObj },
            email,
            messageId,
            threadId
          )
        } else {
          consoleLogAndSendToAWS(
            `User (${emailAddress}). Skipping email ${messageId} from ${sender}. Not handling email, as it is not an order.`
          )
        }
      }
    } catch (error) {
      throw error
    }
  }

  try {
    // Get all History events from this historyId onwards.
    const historyEvents = await _getAllHistoryEvents(historyId)

    // Filter History events to only get emails received.
    const receivedEmails = _filterHistoryEventsForReceivedEmails(historyEvents)

    // Process received emails.
    await _processReceivedEmails(receivedEmails)
  } catch (error) {
    consoleLogAndSendToAWS(
      `Error occurred handling Pub/Sub event (history ID: ${historyId}, user: ${emailAddress}).

${JSON.stringify(error, null, 2)}`,
      {
        consoleLogOverride: `Error occurred handling Pub/Sub event (history ID: ${historyId}, user: ${emailAddress}). See AWS logs for more details.`,
      }
    )
  }
}

const listenForEmails = () => {
  // References an existing subscription
  const subscription = pubSubClient.subscription(subscriptionNameOrId)

  // Create an event handler to handle messages
  const messageHandler = async (message) => {
    try {
      const { emailAddress, historyId } = JSON.parse(message.data.toString())

      const user = await getUserFromEmail(emailAddress)
      if (!user) {
        consoleLogAndSendToAWS(
          `Received message. But user (${emailAddress}) is not in database.`
        )
        return
      }

      if (!user.customers || !user.products) {
        consoleLogAndSendToAWS(
          `User (${emailAddress}) is missing "products" or "customers" fields.`
        )
        return
      }

      const { uid } = user

      const userMetadata = await getUserMetadata(uid)
      if (
        !userMetadata ||
        !userMetadata.gmailRefreshToken ||
        !userMetadata.gmailWatchHistoryId
      ) {
        consoleLogAndSendToAWS(
          `Received message. But user (${emailAddress}) refresh token or history ID is not in database.`
        )
        return
      }

      const { gmailRefreshToken, gmailWatchHistoryId: previousHistoryID } =
        userMetadata

      consoleLogAndSendToAWS(
        `Message received. User is ${emailAddress}. History ID is ${historyId}. Handling...`
      )

      // Main workhorse.
      await handlePubSubEvent(
        emailAddress,
        previousHistoryID,
        user,
        gmailRefreshToken
      )

      await setUserMetadata(uid, { gmailWatchHistoryId: historyId })
    } catch (error) {
      consoleLogAndSendToAWS(
        `Error handling Pub/Sub message, before "handlePubSubEvent()".

${JSON.stringify(error, null, 2)}`,
        {
          consoleLogOverride:
            'Error handling Pub/Sub message, before "handlePubSubEvent()". See AWS logs for more details.',
        }
      )
    } finally {
      // "Ack" (acknowledge receipt of) the message
      message.ack()
    }
  }

  // Listen for new messages
  subscription.on('message', messageHandler)

  console.log(`Listening for Pub/sub: ${subscriptionNameOrId}`)
}

module.exports = { listenForEmails, parseEmail, handlePubSubEvent }
