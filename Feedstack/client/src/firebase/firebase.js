import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSXtO4bs9GD8TBX1r6bIpOi12D0ThKK-I",
  authDomain: "feedstack-b2cc1.firebaseapp.com",
  projectId: "feedstack-b2cc1",
  storageBucket: "feedstack-b2cc1.firebasestorage.app",
  messagingSenderId: "515733206423",
  appId: "1:515733206423:web:66a5f536180b46576a80d2",
  measurementId: "G-RWHK7GJ3CF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };