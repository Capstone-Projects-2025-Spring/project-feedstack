import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { app } from './firebase';


// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDSXtO4bs9GD8TBX1r6bIpOi12D0ThKK-I",
//   authDomain: "feedstack-b2cc1.firebaseapp.com",
//   projectId: "feedstack-b2cc1",
//   storageBucket: "feedstack-b2cc1.firebasestorage.app",
//   messagingSenderId: "515733206423",
//   appId: "1:515733206423:web:66a5f536180b46576a80d2",
//   measurementId: "G-RWHK7GJ3CF"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
