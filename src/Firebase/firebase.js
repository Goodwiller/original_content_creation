// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAa59tfHC3-MkZx9Xu1JxLG_QkWMF8PAA0",
  authDomain: "nftmarketplace-a31ed.firebaseapp.com",
  databaseURL: "https://nftmarketplace-a31ed-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nftmarketplace-a31ed",
  storageBucket: "nftmarketplace-a31ed.appspot.com",
  messagingSenderId: "444323166161",
  appId: "1:444323166161:web:bcf66eea22a78f64f852f0"
};




// Initialize Firebase
const app = initializeApp(firebaseConfig);


const db = getDatabase(app);
const storage = getStorage(app);
export {app, db, storage};