import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    const displayName = user.displayName || user.email.split("@")[0];
    const greetingEl = document.getElementById("user-greeting");
    if (greetingEl) {
      greetingEl.textContent = `Welcome, ${displayName}!`;
    }
  } else {
    window.location.href = "index.html";
  }
});
