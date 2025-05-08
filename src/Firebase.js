
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJoi0XsqJczSKzx8cBVW-edyg43Qc2PnQ",
  authDomain: "gamebop-ebcab.firebaseapp.com",
  projectId: "gamebop-ebcab",
  storageBucket: "gamebop-ebcab.firebasestorage.app",
  messagingSenderId: "724910412129",
  appId: "1:724910412129:web:38ced429b7212366947520"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };