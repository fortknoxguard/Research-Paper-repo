// js/profile.js
import { auth } from "./firebase.js"; 
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Combined Auth Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    const fullName = user.displayName || "User";
    const email = user.email || "";
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Update UI
    const displayNameElem = document.querySelector(".user-display-name");
    const infoBoxes = document.querySelectorAll(".info-box");

    if (displayNameElem) displayNameElem.textContent = fullName;
    if (infoBoxes.length >= 3) {
      infoBoxes[0].textContent = email;
      infoBoxes[1].textContent = firstName;
      infoBoxes[2].textContent = lastName;
    }
  } else {
    // FIXED: Since index.html is your login page, redirect there.
    // Use ../index.html if profile.html is inside a subfolder.
    window.location.href = "../index.html"; 
  }
});

// Logout Function
window.confirmLogout = async () => {
  if (confirm("Are you sure you want to log out?")) {
    try {
      await signOut(auth);
      // FIXED: Redirect back to your login (index.html)
      window.location.replace("../index.html");
    } catch (error) {
      console.error("Logout Error:", error);
      alert("Error logging out. Check console.");
    }
  }
};

// Avatar preview logic
const avatarInput = document.getElementById("avatarInput");
if (avatarInput) {
  avatarInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = document.getElementById("profileImg");
      const icon = document.getElementById("defaultIcon");
      if (img && icon) {
        img.src = ev.target.result;
        img.style.display = "block";
        icon.style.display = "none";
      }
    };
    reader.readAsDataURL(file);
  });
}
