import React, { useState, createContext } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  deleteUser,
  signOut,
} from 'firebase/auth';

import {
  firebaseApp,
  firestoreDB,
  firebaseAuth,
} from '../config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export const AuthenticationContext = createContext();

export const AuthenticationContextProvider = ({ children }) => {
  const auth = getAuth(firebaseApp);

  const [initialLoad, setInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Login persistence
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    }

    if (initialLoad) {
      setIsLoading(false);
      setInitialLoad(false);
    }
  });

  // Login
  const onLogin = async (email, password) => {
    setIsLoading(true);

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      setUser(user);
      console.log('trying to log in');
    } catch (error) {
      setError(error.toString());
      console.error('Error logging in.', error);
    }

    setIsLoading(false);
  };

  // Create Account
  const onCreateAccount = async (email, password, businessName, name) => {
    setIsLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(user);

      const { uid } = user;

      await setDoc(doc(firestoreDB, 'users', uid), {
        uid: uid,
        company: businessName,
        email: email,
        name: name,
      });
    } catch (error) {
      setError(error.message);
      throw new Error();
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const onLogout = async () => {
    const auth = getAuth(firebaseApp);
    await signOut(auth)
      .then(() => {
        // Sign-out successful.
        setUser(null);
      })
      .catch((error) => {
        console.log('error signing out');
      });
  };

  // Delete user
  const onDelete = async () => {
    const auth = getAuth(firebaseApp);
    const user = auth.currentUser;

    await deleteUser(user)
      .then(() => {
        console.log('User Deleted');
        setUser(null);
      })
      .catch((error) => {
        console.log('Error in deleting user');
        console.log(error);
      });
  };

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading,
        error,
        onLogin,
        onCreateAccount,
        onLogout,
        onDelete,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
