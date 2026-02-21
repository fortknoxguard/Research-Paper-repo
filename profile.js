// js/profile.js
import { auth } from "./firebase.js"; 
// We need the database to check the role
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk";
const supabase = createClient(SUPABASE_URL, ANON_KEY);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const fullName = user.displayName || "User";
    const email = user.email || "";
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // 1. Update Profile Info
    const displayNameElem = document.querySelector(".user-display-name");
    const infoBoxes = document.querySelectorAll(".info-box");

    if (displayNameElem) displayNameElem.textContent = fullName;
    if (infoBoxes.length >= 3) {
      infoBoxes[0].textContent = email;
      infoBoxes[1].textContent = firstName;
      infoBoxes[2].textContent = lastName;
    }

    // 2. Update Role Badge (Admin check)
    const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.uid)
        .single();

    const roleBadge = document.querySelector(".user-role-badge");
    if (roleBadge && roleData) {
        roleBadge.textContent = roleData.role === 'admin' ? "Administrator" : "Verified Student";
        if (roleData.role === 'admin') roleBadge.style.background = "#ff4757"; // Make admin badge red
    }

  } else {
    // Redirect to login (root index.html)
    window.location.href = "../index.html"; 
  }
});

// Logout Function
window.confirmLogout = async () => {
  if (confirm("Are you sure you want to log out?")) {
    try {
      await signOut(auth);
      // FIXED: Must go UP one level to find index.html (Login)
      window.location.replace("../index.html");
    } catch (error) {
      console.error("Logout Error:", error);
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
