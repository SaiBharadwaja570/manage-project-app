// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration (replace with your project details)

  const firebaseConfig = {
    apiKey: "AIzaSyDDu0o4pc5NZrLu_D4wzaTjks5BSn-3bl8",
    authDomain: "first-project-18784.firebaseapp.com",
    projectId: "first-project-18784",
    storageBucket: "first-project-18784.firebasestorage.app",
    messagingSenderId: "507173062987",
    appId: "1:507173062987:web:b6bae711bd2862abe680ce",
    measurementId: "G-45E3T0X1BG"
  };


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
