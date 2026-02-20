// js/profile.js
import { auth } from "../js/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    const fullName    = user.displayName || "User";
    const email       = user.email || "";
    const nameParts   = fullName.trim().split(" ");
    const firstName   = nameParts[0] || "";
    const lastName    = nameParts.slice(1).join(" ") || "";

    // Display name & email
    document.querySelector(".user-display-name").textContent = fullName;
    document.querySelectorAll(".info-box")[0].textContent    = email;
    document.querySelectorAll(".info-box")[1].textContent    = firstName;
    document.querySelectorAll(".info-box")[2].textContent    = lastName;
  } else {
    window.location.href = "../login.html";
  }
});

// Avatar preview
const avatarInput = document.getElementById("avatarInput");
if (avatarInput) {
  avatarInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = document.getElementById("profileImg");
      const icon = document.getElementById("defaultIcon");
      img.src = ev.target.result;
      img.style.display = "block";
      icon.style.display = "none";
    };
    reader.readAsDataURL(file);
  });
}

// Logout
window.confirmLogout = async () => {
  await signOut(auth);
  window.location.replace("../login.html");
};

// List of public pages (no login required)
const publicPages = [
  "index.html",
  "register.html"
];

// Get current page
const currentPage = window.location.pathname;

// Check auth state
onAuthStateChanged(auth, (user) => {

  // If NOT logged in and page is protected
  if (!user && !publicPages.some(page => currentPage.endsWith(page))) {
    
    // Redirect to login
    window.location.replace("index.html");
  }

});
