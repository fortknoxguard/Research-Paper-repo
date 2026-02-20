// 1. Use the full CDN URLs for the browser
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDEOvNlFakVu0cvztoL-PhQI54kgc2q0C8",
  authDomain: "user-login-ad4e6.firebaseapp.com",
  projectId: "user-login-ad4e6",
  storageBucket: "user-login-ad4e6.firebasestorage.app",
  messagingSenderId: "815541711200",
  appId: "1:815541711200:web:c6a5a58a91df3321986e05",
  measurementId: "G-WEFZLHB7SC"
};

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 3. Initialize and EXPORT Auth so upload.js can use it
export const auth = getAuth(app);
