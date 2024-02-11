import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAtNioJrwGuLhDs5DH45f_PsZUwm46zs5s",
  authDomain: "toona-d5e9f.firebaseapp.com",
  databaseURL: "https://toona-d5e9f-default-rtdb.firebaseio.com",
  projectId: "toona-d5e9f",
  storageBucket: "toona-d5e9f.appspot.com",
  messagingSenderId: "376546246972",
  appId: "1:376546246972:web:1f823f6581b9e76532de39",
  measurementId: "G-P8EE1L46RV",
};

// Initialize Firebase
console.log("initializing firebase");
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
