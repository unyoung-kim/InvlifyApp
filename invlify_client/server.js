// const admin = require('firebase-admin');
// const serviceAccount = require('../autoinvoice-a1471-firebase-adminsdk-ugjgo-2c27f80183.json');
// const { getFirestore, Timestamp } = require('firebase-admin/firestore');

// // Authentication.
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://autoinvoice-a1471-default-rtdb.firebaseio.com',
// });

// const db = getFirestore();

const express = require('express');
const QuickBooks = require('node-quickbooks');
const app = express();
const cors = require('cors');

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.post('/create-invoice', async (req, res) => {
  console.log('Create Invoice Endpoint Loading...');

  const { userMetadata, order, products } = req.body;
  const { quickbooksAccessToken, quickbooksRealmId, quickbooksRefreshToken } =
    userMetadata;

  var qbo = new QuickBooks(
    'CLIENTID', //Change this to actual clientID
    'CLIENT SECRET', //Change this to actual clientSecret
    quickbooksAccessToken,
    false, // no token secret for oAuth 2.0
    quickbooksRealmId,
    true, // use the sandbox?
    false, // enable debugging?
    null, // set minorversion, or null for the latest version
    '2.0', //oAuth version
    quickbooksRefreshToken
  );

  if (order.status !== 'pending') {
    console.log('Order is not pending');
    return;
  } else {
    const { customerID, lines } = order;

    const customer = { value: customerID };

    let invoiceLines = [];

    for (const line of lines) {
      const product = products[line.id];

      const invoiceLine = {
        DetailType: 'SalesItemLineDetail',
        SalesItemLineDetail: {
          ItemRef: {
            value: line.id, // Replace with the actual item ID for the first line item
          },
          Qty: line.quantity,
        },
        Amount: product.unitPrice * line.quantity,
      };

      invoiceLines.push(invoiceLine);
    }

    const invoiceData = { CustomerRef: customer, Line: invoiceLines };
    console.log('INVOICE DATA: ');
    console.log(invoiceData);

    qbo.createInvoice(invoiceData, (error, invoice) => {
      if (error) {
        // console.error(error);
        console.log('ERROR when creating invoice');
      } else {
        console.log('Invoice created successfully: ');
        console.log(invoice);
      }
    });
  }

  res.json({ message: 'Invoice created successfully!' });
});

const getUpdatedCustomer = async (qbo) => {
  // 1. Get Customer Data from Quickbooks

  return new Promise((resolve, reject) => {
    qbo.findCustomers({}, (error, customers) => {
      if (error) {
        reject(error);
      } else {
        //   console.log(customers.QueryResponse.Customer);
        // Might have to extract only some of the information
        const customerList = customers.QueryResponse.Customer;

        const allCustomers = customerList.reduce((result, item) => {
          const { Id, DisplayName, PrimaryEmailAddr } = item;
          result[DisplayName] = {
            id: Id,
            name: DisplayName,
            email: PrimaryEmailAddr,
          };
          return result;
        }, {});

        resolve(allCustomers);
      }
    });
  });
};

const getUpdatedProduct = (qbo) => {
  // 1. Get Product Data from Quickbooks

  return new Promise((resolve, reject) => {
    qbo.findItems({}, (error, items) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        const productList = items.QueryResponse.Item;

        const allProducts = productList.reduce((result, item) => {
          const { Id, Name, UnitPrice } = item;
          result[Name] = { id: Id, name: Name, unitPrice: UnitPrice };
          return result;
        }, {});

        resolve(allProducts);
      }
    });
  });
};

app.post('/customers', async (req, res) => {
  if (!req.query.uid) {
    res.status(400).send('Missing query parameter.');
    return;
  }

  const { uid } = req.query;

  if (!req.body) {
    res.status(400).send('Missing query parameter.');
    return;
  }

  const { userMetadata } = req.body;
  const { quickbooksAccessToken, quickbooksRealmId, quickbooksRefreshToken } =
    userMetadata;

  var qbo = new QuickBooks(
    'ABYTrFdluHzwBZDesg4sI7sTaGwsAPgpQqDzCf0Z5CyUKicQUM', //Change this to actual clientID
    '36S46DzorRsaLhG7SfXuCRGZyFvPjXUa6SfS5jD1', //Change this to actual clientSecret
    quickbooksAccessToken,
    false, // no token secret for oAuth 2.0
    quickbooksRealmId,
    true, // use the sandbox?
    false, // enable debugging?
    null, // set minorversion, or null for the latest version
    '2.0', //oAuth version
    quickbooksRefreshToken
  );

  try {
    qbo.findCustomers(
      {
        fetchAll: true,
      },
      (error, customers) => {
        if (error) {
          console.log(error);
          res
            .status(500)
            .send('Error retrieving Customers data from QuickBooks.');
        } else {
          const customerList = customers.QueryResponse.Customer;

          const allCustomers = customerList.reduce((result, item) => {
            console.log(item);
            const { Id, DisplayName, PrimaryEmailAddr } = item;
            result[DisplayName] = {
              id: Id,
              name: DisplayName,
              email: PrimaryEmailAddr,
            };
            return result;
          }, {});

          res.json(allCustomers);
        }
      }
    );
  } catch (error) {
    console.error(
      `Error getting user (${uid}) Customers from QuickBooks.`,
      error
    );
    res.status(500).send('Error occured on server.');
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
