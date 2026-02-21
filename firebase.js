import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"; // Added this

const firebaseConfig = {
  apiKey: "AIzaSyDEOvNlFakVu0cvztoL-PhQI54kgc2q0C8",
  authDomain: "user-login-ad4e6.firebaseapp.com",
  projectId: "user-login-ad4e6",
  storageBucket: "user-login-ad4e6.firebasestorage.app",
  messagingSenderId: "815541711200",
  appId: "1:815541711200:web:c6a5a58a91df3321986e05",
  measurementId: "G-WEFZLHB7SC"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


export const db = getFirestore(app);
