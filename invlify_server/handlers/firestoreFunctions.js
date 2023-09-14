const admin = require('firebase-admin')
const serviceAccount = require('../autoinvoice-a1471-firebase-adminsdk-ugjgo-2c27f80183.json')
const { getFirestore, Timestamp } = require('firebase-admin/firestore')

const { consoleLogAndSendToAWS } = require('../utils/AWS')

// Authentication.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://autoinvoice-a1471-default-rtdb.firebaseio.com',
})

const db = getFirestore()

/* User metadata handlers. */
const setUserMetadata = async (
  uid,
  {
    gmailRefreshToken,
    gmailWatchHistoryId,
    gmailWatchExpiration,
    quickbooksRealmId,
    quickbooksAccessToken,
    quickbooksAccessTokenExpiry,
    quickbooksRefreshToken,
    quickbooksRefreshTokenExpiry,
  }
) => {
  const fieldsToSet = {}

  if (gmailRefreshToken) {
    fieldsToSet.gmailRefreshToken = gmailRefreshToken
  }
  if (gmailWatchHistoryId) {
    fieldsToSet.gmailWatchHistoryId = gmailWatchHistoryId
  }
  if (gmailWatchExpiration) {
    fieldsToSet.gmailWatchExpiration = gmailWatchExpiration
  }
  if (quickbooksRealmId) {
    fieldsToSet.quickbooksRealmId = quickbooksRealmId
  }
  if (quickbooksAccessToken) {
    fieldsToSet.quickbooksAccessToken = quickbooksAccessToken
  }
  if (quickbooksAccessTokenExpiry) {
    fieldsToSet.quickbooksAccessTokenExpiry = quickbooksAccessTokenExpiry
  }
  if (quickbooksRefreshToken) {
    fieldsToSet.quickbooksRefreshToken = quickbooksRefreshToken
  }
  if (quickbooksRefreshTokenExpiry) {
    fieldsToSet.quickbooksRefreshTokenExpiry = quickbooksRefreshTokenExpiry
  }

  const docRef = db.collection('user_metadata').doc(uid)
  return await docRef.set(fieldsToSet, { merge: true })
}

const getUserMetadata = async (uid) => {
  if (!uid) {
    return null
  }

  const docRef = db.collection('user_metadata').doc(uid)
  const snapshot = await docRef.get()

  return snapshot.data()
}

/* User handlers. */
const getUser = async (uid) => {
  if (!uid) return null

  const usersRef = db.collection('users').doc(uid)
  const snapshot = await usersRef.get()

  if (snapshot.empty) return null

  return snapshot.data()
}

const getUserFromEmail = async (email) => {
  if (!email) return null

  const usersRef = db.collection('users')
  const snapshot = await usersRef.where('email', '==', email).get()

  if (snapshot.empty) return null

  return snapshot.docs[0].data()
}

/* Order handlers. */
const orderWithThreadIdExists = async (uid, threadId) => {
  if (!uid || !threadId) return false

  const ordersSubcollectionRef = db
    .collection('users')
    .doc(uid)
    .collection('orders')

  const snapshot = await ordersSubcollectionRef
    .where('threadId', '==', threadId)
    .get()

  return !snapshot.empty
}

const addOrderToUser = async (
  emailAddress,
  uid,
  customerId,
  lines,
  deliveryDate,
  threadId
) => {
  const ordersSubcollectionRef = db
    .collection('users')
    .doc(uid)
    .collection('orders')

  const orderObject = {
    customer: customerId,
    lines,
    orderDate: Timestamp.fromDate(new Date()),
    orderDue: Timestamp.fromDate(deliveryDate),
    status: 'pending',
    threadId,
  }

  const orderRef = await ordersSubcollectionRef.add(orderObject)

  consoleLogAndSendToAWS(
    `User (${emailAddress}).
Added order (${JSON.stringify(orderObject, null, 2)}).
UID: ${orderRef.id}
------------------------------------------------`
  )

  return orderRef
}

module.exports = {
  setUserMetadata,
  getUserMetadata,
  getUser,
  getUserFromEmail,
  orderWithThreadIdExists,
  addOrderToUser,
}
