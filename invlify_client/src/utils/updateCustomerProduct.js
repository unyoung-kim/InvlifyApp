import { firestoreDB } from '../config/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { updateCustomer, updateProducts } from '../utils';

export const updateCustomerAndProduct = async (user) => {
  if (!user) {
    return;
  }

  const userRef = doc(firestoreDB, 'users', user?.uid);

  console.log('Update Customer...');
  updateCustomer(user.uid)
    .then((customers) => {
      updateDoc(userRef, {
        customers: customers,
      });
    })
    .catch((err) => {
      console.log(err);
    });

  updateProducts(user.uid)
    .then((products) => {
      updateDoc(userRef, {
        products: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
