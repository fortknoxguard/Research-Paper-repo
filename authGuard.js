// FIXED: Added "./" and matched the Firebase version
import { auth } from "./firebase.js"; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // FIXED: Removed the leading "/" to keep it in the root
    window.location.replace("login.html");
  }
});
