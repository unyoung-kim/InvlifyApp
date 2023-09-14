const express = require('express')
const axios = require('axios')
const QuickBooks = require('node-quickbooks')

const {
  getUserMetadata,
  getUser,
  addOrderToUser,
} = require('../handlers/firestoreFunctions')
const {
  quickbooksClientId,
  quickbooksClientSecret,
  useQuickBooksProd,
} = require('../constants')

// Router.
const quickbooksRouter = express.Router()

const _createQuickBooksClient = (
  quickbooksAccessToken,
  quickbooksRefreshToken,
  quickbooksRealmId
) => {
  return new QuickBooks(
    quickbooksClientId,
    quickbooksClientSecret,
    quickbooksAccessToken,
    false, // no token secret for oAuth 2.0
    quickbooksRealmId,
    !useQuickBooksProd, // use the sandbox?
    false, // enable debugging?
    null, // set minorversion, or null for the latest version
    '2.0', // OAuth version
    quickbooksRefreshToken
  )
}

quickbooksRouter.get('/customers', async (req, res) => {
  if (!req.query.uid) {
    res.status(400).send('Missing query parameter.')
    return
  }

  const { uid } = req.query

  try {
    const userMetadata = await getUserMetadata(uid)
    if (!userMetadata) {
      res.status(500).send('User metadata not found.')
      return
    }

    const { quickbooksAccessToken, quickbooksRefreshToken, quickbooksRealmId } =
      userMetadata

    const qbo = _createQuickBooksClient(
      quickbooksAccessToken,
      quickbooksRefreshToken,
      quickbooksRealmId
    )

    qbo.findCustomers(
      {
        fetchAll: true,
      },
      (error, customers) => {
        if (error) {
          console.log(
            `Error getting Customers data from UID: ${uid}`,
            JSON.stringify(error, null, 2)
          )

          res
            .status(500)
            .send('Error retrieving Customers data from QuickBooks.')
        } else {
          const customerList = customers.QueryResponse.Customer

          const allCustomers = customerList.reduce((result, item) => {
            const { Id, DisplayName, PrimaryEmailAddr = { Address: '' } } = item
            result[Id] = {
              name: DisplayName,
              email: PrimaryEmailAddr,
            }
            return result
          }, {})

          res.json(allCustomers)
        }
      }
    )
  } catch (error) {
    console.error(
      `Error getting user (${uid}) Customers from QuickBooks.`,
      error
    )
    res.status(500).send('Error occured on server.')
  }
})

quickbooksRouter.get('/products', async (req, res) => {
  if (!req.query.uid) {
    res.status(400).send('Missing query parameter.')
    return
  }

  const { uid } = req.query

  try {
    const userMetadata = await getUserMetadata(uid)
    if (!userMetadata) {
      res.status(500).send('User metadata not found.')
      return
    }

    const { quickbooksAccessToken, quickbooksRefreshToken, quickbooksRealmId } =
      userMetadata

    const qbo = _createQuickBooksClient(
      quickbooksAccessToken,
      quickbooksRefreshToken,
      quickbooksRealmId
    )

    qbo.findItems(
      {
        fetchAll: true,
      },
      (error, items) => {
        if (error) {
          res
            .status(500)
            .send('Error retrieving Customers data from QuickBooks.')
        } else {
          const productList = items.QueryResponse.Item

          const allProducts = productList.reduce((result, item) => {
            const { Id, Name, UnitPrice = 0 } = item
            result[Id] = { name: Name, unitPrice: UnitPrice }
            return result
          }, {})

          res.json(allProducts)
        }
      }
    )
  } catch (error) {
    console.error(
      `Error getting user (${uid}) Customers from QuickBooks.`,
      error
    )
    res.status(500).send('Error occured on server.')
  }
})

quickbooksRouter.post('/create-invoice', async (req, res) => {
  if (!req.query.uid) {
    res.status(400).send('Missing query parameters.')
    return
  }

  const { uid } = req.query

  if (!req.body.order) {
    res.status(400).send('Missing body fields. Should have { order, products }')
    return
  }

  try {
    const { order } = req.body

    const userMetadata = await getUserMetadata(uid)
    if (!userMetadata) {
      res.status(500).send('User metadata not found.')
      return
    }

    const user = await getUser(uid)
    if (!user) {
      res.status(500).send('User not found.')
      return
    }

    const { quickbooksAccessToken, quickbooksRefreshToken, quickbooksRealmId } =
      userMetadata

    const qbo = _createQuickBooksClient(
      quickbooksAccessToken,
      quickbooksRefreshToken,
      quickbooksRealmId
    )

    if (order.status !== 'pending') {
      res.status(400).send('Order is not pending.')
      return
    } else {
      const { customer, lines } = order

      const customerRef = { value: customer }

      const invoiceLines = []

      for (const { product: productId, quantity } of lines) {
        const product = user.products[productId]

        if (!product) {
          console.log(
            `Skipping product ID (${productId}) as it is not in product list.`
          )
          continue
        }

        const invoiceLine = {
          DetailType: 'SalesItemLineDetail',
          SalesItemLineDetail: {
            ItemRef: {
              value: productId, // Replace with the actual item ID for the first line item
            },
            Qty: quantity,
          },
          Amount: product.unitPrice * quantity,
        }

        invoiceLines.push(invoiceLine)
      }

      const invoiceData = { CustomerRef: customerRef, Line: invoiceLines }

      qbo.createInvoice(invoiceData, (error, invoice) => {
        if (error) {
          console.error(
            'Error trying to create invoice.',
            JSON.stringify(error, null, 2)
          )
          res.status(500).send('Server error trying to create invoice.')
        } else {
          res.send('Invoice created successfully.')
        }
      })
    }
  } catch (error) {
    console.error('Error trying to create invoice.', error)
    res.status(500).send('Server error trying to create invoice.')
  }
})

module.exports = quickbooksRouter
