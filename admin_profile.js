
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { auth } from "./firebase.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";
const ANON_KEY = "your-anon-key-here"; 
const supabase = createClient(SUPABASE_URL, ANON_KEY);

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.replace("index.html");
    } else {
        // 1. Fill the Email from Firebase
        document.querySelector(".user-email").innerText = user.email;

        // 2. Fetch First/Last name from Supabase 'profiles' table
        const { data, error } = await supabase
            .from('profiles') // Adjust if your table name is different
            .select('first_name, last_name')
            .eq('id', user.uid)
            .single();

        if (data) {
            document.querySelector(".first-name").innerText = data.first_name;
            document.querySelector(".last-name").innerText = data.last_name;
            document.getElementById("displayName").innerText = `${data.first_name} ${data.last_name}`;
        } else {
            console.log("No profile found in Supabase for this user.");
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
