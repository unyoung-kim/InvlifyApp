require('dotenv').config()

const express = require('express')
const cors = require('cors')
const session = require('express-session')
const bodyParser = require('body-parser')

// Routers.
const authRouter = require('./routers/auth')
const gmailRouter = require('./routers/gmail')
const quickbooksRouter = require('./routers/quickbooks')

// Pub/Sub.
const { listenForEmails } = require('./handlers/gmailPubSubListener')

listenForEmails()

// Express app.
const app = express()
const port = 3100

// Middleware.
app.set('view engine', 'ejs')
app.use(session({ secret: 'locavore', resave: false, saveUninitialized: true }))
app.use(cors({ origin: '*' }))
app.use(bodyParser.json())

// Routes.
app.get('/', (req, res) => res.render('home'))

app.use('/auth', authRouter)
app.use('/gmail', gmailRouter)
app.use('/quickbooks', quickbooksRouter)

// Test routes.
const { getUser, addOrderToUser } = require('./handlers/firestoreFunctions')

// app.get('/_test/firestore/user/addorder', async (req, res) => {
//   try {
//     const orderAddedResponse = await addOrderToUser(req.query.email)
//     res.json(orderAddedResponse)
//   } catch (error) {
//     console.error(error)
//     res.send(error)
//   }
// })

app.get('/_test/firestore/user', async (req, res) => {
  if (!req.query.email) {
    res.send('Missing query params')
    return
  }

  try {
    const userDetails = await getUser(req.query.email)

    res.json(userDetails)
  } catch (error) {
    console.error(error)
    res.send(error)
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
