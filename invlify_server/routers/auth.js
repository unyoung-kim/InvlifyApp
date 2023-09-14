const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

const {
  setUserMetadata,
  getUserMetadata,
} = require('../handlers/firestoreFunctions')
const {
  domainToUse,
  quickbooksClientId,
  quickbooksClientSecret,
  useQuickBooksProd,
} = require('../constants')

// Router.
const authRouter = express.Router()

/*************************
 * Google Authentication *
 *************************/

// Passport setup.
passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${domainToUse}/auth/google/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const { uid } = JSON.parse(req.query.state)

      if (uid) {
        await setUserMetadata(uid, { gmailRefreshToken: refreshToken })
      }

      // console.log(`${profile.displayName} refresh token is: ${refreshToken}`)
      done(null, profile, {})
    }
  )
)

// Middleware.
authRouter.use(passport.initialize())

// Routes.
authRouter.get('/google', (req, res, next) => {
  if (!req.query.uid || !req.query.redirectUrl) {
    res.send('Missing query parameter.')
    return
  }

  const { uid, redirectUrl } = req.query

  passport.authenticate('google', {
    scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/gmail.readonly',
    ],
    accessType: 'offline',
    prompt: 'consent',
    state: JSON.stringify({ uid, redirectUrl }),
  })(req, res, next)
})

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const { redirectUrl } = JSON.parse(req.query.state)

    try {
      res.redirect(redirectUrl)
    } catch (error) {
      console.log(error)
    }
  }
)

/*****************************
 * QuickBooks Authentication *
 *****************************/

const IntuitOAuthClient = require('intuit-oauth')

const oauthClient = new IntuitOAuthClient({
  clientId: quickbooksClientId,
  clientSecret: quickbooksClientSecret,
  environment: useQuickBooksProd ? 'production' : 'sandbox',
  redirectUri: `${domainToUse}/auth/quickbooks/callback`,
})

authRouter.get('/quickbooks', (req, res) => {
  if (!req.query.uid || !req.query.redirectUrl) {
    res.send('Missing query parameter.')
    return
  }

  const { uid, redirectUrl } = req.query

  const authUri = oauthClient.authorizeUri({
    scope: [
      IntuitOAuthClient.scopes.Accounting,
      IntuitOAuthClient.scopes.OpenId,
      IntuitOAuthClient.scopes.Email,
    ],
    state: JSON.stringify({ uid, redirectUrl }),
  })

  res.redirect(authUri)
})

authRouter.get('/quickbooks/callback', async (req, res) => {
  const parseRedirect = req.url

  try {
    const authResponse = await oauthClient.createToken(parseRedirect)

    const {
      realmId = 'nil',
      access_token = 'nil',
      refresh_token = 'nil',
      state,
      createdAt, // UNIX epoch (milliseconds)
      expires_in, // Seconds
      x_refresh_token_expires_in, // Seconds
    } = authResponse.token

    const { uid, redirectUrl } = JSON.parse(state)

    const accessTokenExpiry = createdAt + expires_in * 1000
    const refreshTokenExpiry = createdAt + x_refresh_token_expires_in * 1000

    await setUserMetadata(uid, {
      quickbooksRealmId: realmId,
      quickbooksAccessToken: access_token,
      quickbooksAccessTokenExpiry: accessTokenExpiry,
      quickbooksRefreshToken: refresh_token,
      quickbooksRefreshTokenExpiry: refreshTokenExpiry,
    })

    res.redirect(redirectUrl)
  } catch (error) {
    console.error('Quickbook auth error', error)
    res.status(500).send('Error occured on server.')
  }
})

authRouter.get('/quickbooks/refresh-access-token', async (req, res) => {
  try {
    if (!req.query.uid) {
      res.status(400).send('Missing query parameter.')
      return
    }

    const { uid } = req.query

    const { quickbooksRefreshToken } = await getUserMetadata(uid)
    if (!quickbooksRefreshToken) {
      res.send('User refresh token is not in database.')
      return
    }

    const authResponse = await oauthClient.refreshUsingToken(
      quickbooksRefreshToken
    )

    const {
      access_token,
      refresh_token,
      createdAt, // UNIX epoch (milliseconds)
      expires_in, // Seconds
    } = authResponse.token

    const accessTokenExpiry = createdAt + expires_in * 1000

    await setUserMetadata(uid, {
      quickbooksAccessToken: access_token,
      quickbooksAccessTokenExpiry: accessTokenExpiry,
      quickbooksRefreshToken: refresh_token,
    })

    res.json('ok')
  } catch (error) {
    console.error(
      'Error occured refreshing QuickBooks access token.',
      JSON.stringify(error, null, 2)
    )
    res.status(500).send('Error occured on server.')
  }
})

module.exports = authRouter
