import { firestoreDB } from '../config/firebaseConfig';

import { doc, getDoc } from 'firebase/firestore';

export const getUserMetadata = async (uid) => {
  if (!uid) {
    return null;
  }

  const docRef = doc(firestoreDB, 'user_metadata', uid);
  const snapshot = await getDoc(docRef);

  return snapshot.data();
};
