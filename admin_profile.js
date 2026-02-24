import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { auth } from "./firebase.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";
// REMEMBER: Paste your real long ANON_KEY here
const ANON_KEY = "your-anon-key-here"; 
const supabase = createClient(SUPABASE_URL, ANON_KEY);

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.replace("index.html");
    } else {
        // 1. Fill Email
        const emailEl = document.querySelector(".user-email");
        if (emailEl) emailEl.innerText = user.email;

        // 2. Fetch from Supabase
        const { data, error } = await supabase
            .from('user_role') 
            .select('first_name, last_name')
            .eq('id', user.uid)
            .single();

        if (data) {
            const firstName = data.first_name || "N/A";
            const lastName = data.last_name || "N/A";

            // Target the DASH versions to match CSS/HTML
            const fNameEl = document.querySelector(".first-name");
            const lNameEl = document.querySelector(".last-name");
            const displayEl = document.getElementById("displayName");

            if (fNameEl) fNameEl.innerText = firstName;
            if (lNameEl) lNameEl.innerText = lastName;
            if (displayEl) displayEl.innerText = `${firstName} ${lastName}`;
        } else {
            // Detailed error logging to fix the "Object" message in DevTools
            console.error("Supabase Error Details:", error);
            
            // Fallback UI
            const fNameBox = document.querySelector(".first-name");
            const lNameBox = document.querySelector(".last-name");
            if (fNameBox) fNameBox.innerText = "Not Found";
            if (lNameBox) lNameBox.innerText = "Not Found";
        }
    }
});

window.saveProfile = () => {
    const user = document.getElementById('username').value;
    const fname = document.getElementById('firstName').value;
    const lname = document.getElementById('lastName').value;
    document.getElementById('displayName').innerText = fname + " " + lname;
    
    alert("Profile successfully updated!\nNew Username: " + user);
}

window.confirmLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
        try {
            await signOut(auth);
            window.location.replace("index.html"); 
        } catch (error) {
            console.error("Logout Error:", error);
        }
    }
};
