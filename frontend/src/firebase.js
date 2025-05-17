// firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  getRedirectResult,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDu0o4pc5NZrLu_D4wzaTjks5BSn-3bl8",
  authDomain: "first-project-18784.firebaseapp.com",
  projectId: "first-project-18784",
  messagingSenderId: "507173062987",
  appId: "1:507173062987:web:b6bae711bd2862abe680ce",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export {
  auth,
  googleProvider,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  getRedirectResult,
  signOut,
};
