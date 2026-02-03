// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEOvNlFakVu0cvztoL-PhQI54kgc2q0C8",
  authDomain: "user-login-ad4e6.firebaseapp.com",
  projectId: "user-login-ad4e6",
  storageBucket: "user-login-ad4e6.firebasestorage.app",
  messagingSenderId: "815541711200",
  appId: "1:815541711200:web:c6a5a58a91df3321986e05",
  measurementId: "G-WEFZLHB7SC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
