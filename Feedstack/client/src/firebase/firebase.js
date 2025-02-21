import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCmNWPwbpek6hBUkNdgvWMqleSOeIxNXeU",
  authDomain: "feedstack-9c0f0.firebaseapp.com",
  databaseURL: "https://feedstack-9c0f0-default-rtdb.firebaseio.com",
  projectId: "feedstack-9c0f0",
  storageBucket: "feedstack-9c0f0.appspot.com",
  messagingSenderId: "292313609879",
  appId: "1:292313609879:web:ee17ae3981145507bc1bd2",
  measurementId: "G-K7LH8GFHVL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };