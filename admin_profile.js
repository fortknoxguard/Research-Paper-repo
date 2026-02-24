import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { auth } from "./firebase.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";

const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk"; 
const supabase = createClient(SUPABASE_URL, ANON_KEY);

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.replace("index.html");
    } else {
        document.querySelector(".user-email").innerText = user.email;

        const { data, error } = await supabase
            .from('user_roles') // Fixed: added 's'
            .select('first_name, last_name')
            .eq('user_id', user.uid) // Fixed: changed 'id' to 'user_id'
            .single();

        if (data && data.first_name) {
            const fName = data.first_name;
            const lName = data.last_name || "";
            
            document.querySelector(".first-name").innerText = fName;
            document.querySelector(".last-name").innerText = lName;
            document.getElementById("displayName").innerText = `${fName} ${lName}`;
        } else {
            console.error("Supabase error or missing names:", error);
            document.querySelector(".first-name").innerText = "Admin";
            document.querySelector(".last-name").innerText = "User";
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
