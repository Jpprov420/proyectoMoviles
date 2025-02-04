// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCy_eBQk7L6j7Y621AZzSCSJZnScKmwzyQ",
  authDomain: "proyectomoviles-c0419.firebaseapp.com",
  projectId: "proyectomoviles-c0419",
  storageBucket: "proyectomoviles-c0419.firebasestorage.app",
  messagingSenderId: "89987720018",
  appId: "1:89987720018:web:f78f9594b4182c5bac108b",
  measurementId: "G-K75WHB0RD9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app };