import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCY_bf5xZxOvf6J4YwjzAcUNzkwAAQYCM",
  authDomain: "patient-reminder-94785.firebaseapp.com",
  projectId: "patient-reminder-94785",
  storageBucket: "patient-reminder-94785.appspot.com",
  messagingSenderId: "356181246305",
  appId: "1:356181246305:web:b21f417eabae5afc6d4520",
  measurementId: "G-WRS0B69RBR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, analytics };