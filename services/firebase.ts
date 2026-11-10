import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoTRGKn9waOn2HidOG4HIsm5EgHhS5T_k",
  authDomain: "hostelconnect-d87d6.firebaseapp.com",
  projectId: "hostelconnect-d87d6",
  storageBucket: "hostelconnect-d87d6.firebasestorage.app",
  messagingSenderId: "731105666950",
  appId: "1:731105666950:web:944cb628a10b7f2480ee07",
  measurementId: "G-G3W4EYGD2W"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize session persistence
setPersistence(auth, browserLocalPersistence).catch(console.error);
