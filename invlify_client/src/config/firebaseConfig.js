// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDeD1V7qqQ3u8wiSp381wb9A8Hdv27iEXU",
  authDomain: "autoinvoice-a1471.firebaseapp.com",
  projectId: "autoinvoice-a1471",
  storageBucket: "autoinvoice-a1471.appspot.com",
  messagingSenderId: "931158460213",
  appId: "1:931158460213:web:592e9067f9633bdcdb2e7c",
  measurementId: "G-KCG4FNEGQP",
};

// Initialize Firebase
// let firebaseApp, firebaseAuth, firestoreDB;

// if (!getApps().length) {
//   try {
//     firebaseApp = initializeApp(firebaseConfig);
//     firebaseAuth = getAuth(firebaseApp);
//   } catch (err) {
//     console.log("error initializing");
//   }
// }
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);

// firebaseApp = getApp();

const firestoreDB = getFirestore(firebaseApp);

export { firebaseApp, firebaseAuth, firestoreDB };
