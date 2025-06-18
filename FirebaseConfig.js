// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGmrrutYSizxP_G7Zd4yiXIC6Jx_GfGHs",
  authDomain: "orcamentos-323c9.firebaseapp.com",
  projectId: "orcamentos-323c9",
  storageBucket: "orcamentos-323c9.firebasestorage.app",
  messagingSenderId: "657869494660",
  appId: "1:657869494660:web:6f5c42bc73e48a2d1065d1",
  measurementId: "G-6EZWKG34KV"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };
export { signInWithEmailAndPassword } from 'firebase/auth';