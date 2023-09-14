import {
  collection,
  query,
  orderBy,
  getDoc,
  where,
  Timestamp,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

import { firestoreDB } from '../config/firebaseConfig';

const useDev = false;

const devDomain = 'https://774b-24-17-127-170.ngrok-free.app';
const prodDomain = 'https://locavorapi.com';
export const domainToUse = useDev ? devDomain : prodDomain;

export const refreshQuickbooksAccessToken = async (uid) => {
  if (!uid) return;

  const res = await fetch(
    `${domainToUse}/auth/quickbooks/refresh-access-token?uid=${uid}`
  );

  if (res.status === 200) {
    const data = res.json();
    console.log(data);
  }
};

export const watchEmail = async (uid) => {
  if (!uid) return;

  await fetch(`${domainToUse}/gmail/watch?uid=${uid}`);
};

export const createInvoice = async (userMetadata, order, products, uid) => {
  const orderRef = await doc(
    firestoreDB,
    'users',
    uid,
    'orders',
    order.orderID
  );

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userMetadata, order, products }), // Convert the object to a JSON string and set it as the request body
  };

  const res = await fetch(
    `${domainToUse}/quickbooks/create-invoice?uid=${uid}`,
    requestOptions
  );

  if (res.status === 200) {
    await updateDoc(orderRef, {
      status: 'confirmed',
    });

    // const data = res.json();
    console.log('Created Invoice');
    return;
  } else {
    console.log('Error in creating Invoice');
  }
};

export const updateCustomer = async (uid) => {
  if (!uid) return;

  const res = await fetch(`${domainToUse}/quickbooks/customers?uid=${uid}`);

  if (res.status === 200) {
    const data = res.json();
    const userRef = doc(firestoreDB, 'users', uid);

    await data.then((customer) => {
      updateDoc(userRef, {
        customers: customer,
      });
    });

    return data;
  }
  return null;
};

export const updateProducts = async (uid) => {
  if (!uid) return;

  const res = await fetch(`${domainToUse}/quickbooks/products?uid=${uid}`);

  if (res.status === 200) {
    const data = res.json();

    const userRef = doc(firestoreDB, 'users', uid);

    await data.then((product) => {
      updateDoc(userRef, {
        products: product,
      });
    });

    return data;
  }
  return null;
};
