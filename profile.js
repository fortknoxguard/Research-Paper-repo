import { auth } from "./firebase.js"; 
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

    const displayNameElem = document.querySelector(".user-display-name");
    const infoBoxes = document.querySelectorAll(".info-box");

    if (displayNameElem) displayNameElem.textContent = fullName;
    if (infoBoxes.length >= 3) {
      infoBoxes[0].textContent = email;
      infoBoxes[1].textContent = firstName;
      infoBoxes[2].textContent = lastName;
    }


    const { data: profileData } = await supabase
        .from('profile')
        .select('avatar_url')
        .eq('id', user.uid)
        .single();

    if (profileData?.avatar_url) {
        const img = document.getElementById("profileImg");
        const icon = document.getElementById("defaultIcon");
        if (img) {
            img.src = profileData.avatar_url;
            img.style.display = "block";
            if (icon) icon.style.display = "none";
        }
    }


    const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.uid);

    const roleBadge = document.querySelector(".user-role-badge");
    if (roleBadge) {
        const actualRole = (roleData && roleData.length > 0) ? roleData[0].role : 'student';
        if (actualRole === 'admin') {
            roleBadge.textContent = "Administrator";
            roleBadge.style.background = "#ff4757";
        } else {
            roleBadge.textContent = "Verified Student";
            roleBadge.style.background = "#2ed573";
        }
    }
  } else {
    window.location.href = "../index.html"; 
  }
});


const avatarInput = document.getElementById("avatarInput");
if (avatarInput) {
  avatarInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    const user = auth.currentUser;
    if (!file || !user) return;


    const img = document.getElementById("profileImg");
    const icon = document.getElementById("defaultIcon");
    img.src = URL.createObjectURL(file);
    img.style.display = "block";
    if (icon) icon.style.display = "none";

    try {
        const fileExt = file.name.split('.').pop();
        const filePath = `avatars/${user.uid}.${fileExt}`;


        let { error: uploadError } = await supabase.storage
            .from('profile')
            .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;


        const { data } = supabase.storage.from('profile').getPublicUrl(filePath);
        const publicUrl = data.publicUrl;

        await supabase.from('profile').upsert({ 
            id: user.uid, 
            avatar_url: publicUrl 
        });

        console.log("Profile picture saved permanently!");
    } catch (err) {
        console.error("Upload failed:", err.message);
        alert("Failed to save image to database.");
    }
  });
}

window.confirmLogout = async () => {
  if (confirm("Are you sure you want to log out?")) {
    try {
      await signOut(auth);
      window.location.replace("../index.html");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  }
};
