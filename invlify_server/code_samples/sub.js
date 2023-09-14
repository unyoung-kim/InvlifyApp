/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const subscriptionNameOrId =
  'projects/gmail-api-sandbox-391202/subscriptions/my-sub'
const timeout = 3600

// Imports the Google Cloud client library
const { PubSub } = require('@google-cloud/pubsub')

// Creates a client; cache this for further use
const pubSubClient = new PubSub()

function listenForMessages(subscriptionNameOrId, timeout) {
  // References an existing subscription
  const subscription = pubSubClient.subscription(subscriptionNameOrId)

  // Create an event handler to handle messages
  let messageCount = 0
  const messageHandler = (message) => {
    console.log(`Received message ${message.id}:`)
    console.log(`\tData: ${message.data}`)
    console.log(`\tAttributes: ${message.attributes}`)
    messageCount += 1

    // "Ack" (acknowledge receipt of) the message
    message.ack()
  }

  // Listen for new messages until timeout is hit
  subscription.on('message', messageHandler)

  // Wait a while for the subscription to run. (Part of the sample only.)
  setTimeout(() => {
    subscription.removeListener('message', messageHandler)
    console.log(`${messageCount} message(s) received.`)
  }, timeout * 1000)
}

listenForMessages(subscriptionNameOrId, timeout)
