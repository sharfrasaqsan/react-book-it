import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMVlvwl_ZSmZmcTwts0Ib-mP7uvpr5WAE",
  authDomain: "book-it-d0e63.firebaseapp.com",
  projectId: "book-it-d0e63",
  storageBucket: "book-it-d0e63.firebasestorage.app",
  messagingSenderId: "1009993610142",
  appId: "1:1009993610142:web:f30b3bd2b2492b11389c8f",
  measurementId: "G-8Z21PT48SV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
