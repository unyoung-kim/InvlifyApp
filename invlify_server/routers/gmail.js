const express = require('express')
const { google } = require('googleapis')
const axios = require('axios')

const {
  generateGoogleRequestForAxios,
  generateGmailWatchRequestForAxios,
} = require('../utils/requestGenerators')
const {
  setUserMetadata,
  getUserMetadata,
  getUser,
} = require('../handlers/firestoreFunctions')
const { upload } = require('../utils/multer')
const { domainToUse, pubSubTopicToUse } = require('../constants')

// Router.
const gmailRouter = express.Router()

// OAuth client.
const createGoogleOAuth2Client = (refreshToken) => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    `${domainToUse}/auth/google/callback`
  )

  oAuth2Client.setCredentials({ refresh_token: refreshToken })

  return oAuth2Client
}

// Routes
gmailRouter.get('/user', async (req, res) => {
  if (!req.query.uid) {
    res.status(400).send('Missing query param.')
    return
  }

  const uid = req.query.uid

  try {
    const { gmailRefreshToken } = await getUserMetadata(uid)
    if (!gmailRefreshToken) {
      res.status(500).send('User refresh token is not in database.')
      return
    }

    const oAuth2Client = createGoogleOAuth2Client(gmailRefreshToken)

    const userDetails = await getUser(uid)
    if (!userDetails?.email) {
      res.status(500).send('User is not in database.')
      return
    }

    const url = `https://gmail.googleapis.com/gmail/v1/users/${userDetails.email}/profile`
    const { token } = await oAuth2Client.getAccessToken()
    const request = generateGoogleRequestForAxios(url, token)
    const response = await axios(request)
    res.json(response.data)
  } catch (error) {
    console.error(error)
    res.send(error)
  }
})

gmailRouter.get('/watch', async (req, res) => {
  if (!req.query.uid) {
    res.status(400).send('Missing query param.')
    return
  }

  const uid = req.query.uid

  try {
    const userMetadata = await getUserMetadata(uid)
    if (!userMetadata?.gmailRefreshToken) {
      res.status(500).send('User refresh token is not in database.')
      return
    }

    const oAuth2Client = createGoogleOAuth2Client(
      userMetadata.gmailRefreshToken
    )

    const userDetails = await getUser(uid)
    if (!userDetails?.email) {
      res.status(500).send('User is not in database.')
      return
    }

    const url = `https://gmail.googleapis.com/gmail/v1/users/${userDetails.email}/watch`
    const { token } = await oAuth2Client.getAccessToken()
    const request = generateGmailWatchRequestForAxios(url, token)
    const response = await axios({
      ...request,
      data: {
        labelIds: ['UNREAD'],
        topicName: pubSubTopicToUse,
        labelFilterBehavior: 'include',
      },
    })

    const { historyId, expiration } = response.data

    await setUserMetadata(uid, {
      gmailWatchHistoryId: historyId,
      gmailWatchExpiration: expiration,
    })

    res.send(`Started watching ${userDetails.email}`)
  } catch (error) {
    console.error(error)
    res.send(error)
  }
})

gmailRouter.get('/stop-watching', async (req, res) => {
  if (!req.query.uid) {
    res.status(400).send('Missing query param.')
    return
  }

  const uid = req.query.uid

  try {
    const userMetadata = await getUserMetadata(uid)
    if (!userMetadata?.gmailRefreshToken) {
      res.status(500).send('User refresh token is not in database.')
      return
    }

    const oAuth2Client = createGoogleOAuth2Client(
      userMetadata.gmailRefreshToken
    )

    const userDetails = await getUser(uid)
    if (!userDetails?.email) {
      res.status(500).send('User is not in database.')
      return
    }

    const url = `https://gmail.googleapis.com/gmail/v1/users/${userDetails.email}/stop`
    const { token } = await oAuth2Client.getAccessToken()
    const request = generateGmailWatchRequestForAxios(url, token)
    const response = await axios(request)

    if (response.data === '') {
      res.send('Stop watching successful.')
    } else {
      res.send(response.json)
    }
  } catch (error) {
    console.error(error)
    res.send(error)
  }
})

/* Test routes */
gmailRouter.get('/_test/history', async (req, res) => {
  if (!req.query.uid || !req.query.historyId) {
    res.status(400).send('Missing query param.')
    return
  }

  const uid = req.query.uid
  const historyId = req.query.historyId

  try {
    const { gmailRefreshToken } = await getUserMetadata(uid)
    if (!gmailRefreshToken) {
      res.status(500).send('User refresh token is not in database.')
      return
    }

    const oAuth2Client = createGoogleOAuth2Client(gmailRefreshToken)

    const userDetails = await getUser(uid)
    if (!userDetails?.email) {
      res.status(500).send('User is not in database.')
      return
    }

    const url = `https://gmail.googleapis.com/gmail/v1/users/${userDetails.email}/history?startHistoryId=${historyId}`
    const { token } = await oAuth2Client.getAccessToken()
    const request = generateGoogleRequestForAxios(url, token)
    const response = await axios(request)
    res.json(response.data)
  } catch (error) {
    console.error(error)
    res.send(error)
  }
})

gmailRouter.get('/_test/messages', async (req, res) => {
  if (!req.query.uid || !req.query.messageId) {
    res.status(400).send('Missing query param.')
    return
  }

  const uid = req.query.uid
  const messageId = req.query.messageId

  try {
    const { gmailRefreshToken } = await getUserMetadata(uid)
    if (!gmailRefreshToken) {
      res.status(500).send('User refresh token is not in database.')
      return
    }

    const oAuth2Client = createGoogleOAuth2Client(gmailRefreshToken)

    const userDetails = await getUser(uid)
    if (!userDetails?.email) {
      res.status(500).send('User is not in database.')
      return
    }

    const url = `https://gmail.googleapis.com/gmail/v1/users/${userDetails.email}/messages/${messageId}`
    const { token } = await oAuth2Client.getAccessToken()
    const request = generateGoogleRequestForAxios(url, token)
    const response = await axios(request)
    res.json(response.data)
  } catch (error) {
    console.error(error)
    res.send(error)
  }
})

gmailRouter.get('/_test/threads', async (req, res) => {
  if (!req.query.uid || !req.query.threadId) {
    res.status(400).send('Missing query param.')
    return
  }

  const uid = req.query.uid
  const threadId = req.query.threadId

  try {
    const { gmailRefreshToken } = await getUserMetadata(uid)
    if (!gmailRefreshToken) {
      res.status(500).send('User refresh token is not in database.')
      return
    }

    const oAuth2Client = createGoogleOAuth2Client(gmailRefreshToken)

    const userDetails = await getUser(uid)
    if (!userDetails?.email) {
      res.status(500).send('User is not in database.')
      return
    }

    const url = `https://gmail.googleapis.com/gmail/v1/users/${userDetails.email}/threads/${threadId}`
    const { token } = await oAuth2Client.getAccessToken()
    const request = generateGoogleRequestForAxios(url, token)
    const response = await axios(request)
    res.json(response.data)
  } catch (error) {
    console.error(error)
    res.send(error)
  }
})

gmailRouter.post(
  '/_test/cloud-vision',
  upload.single('pdf-file'),
  async (req, res) => {
    try {
      const buffer7Bit = req.file.buffer
      const pdfFileAsBase64String = buffer7Bit.toString('base64')

      const cloudVisionReqBody = {
        requests: [
          {
            inputConfig: {
              content: pdfFileAsBase64String,
              mimeType: 'application/pdf',
            },
            features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
          },
        ],
      }

      const cloudVisionReq = {
        method: 'post',
        url: `https://vision.googleapis.com/v1/files:annotate?key=${process.env.GOOGLE_SERVICE_KEY}`,
        headers: {
          'Content-type': 'application/json',
        },
        data: cloudVisionReqBody,
      }

      const response = await axios(cloudVisionReq)
      res.json(response.data)
    } catch (error) {
      console.error('OCR error', error)
      res.status(500).send(error)
    }
  }
)

module.exports = gmailRouter
