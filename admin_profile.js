
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
        // 1. Fill Email (Working)
        document.querySelector(".user-email").innerText = user.email;

        // 2. Fetch First/Last name
        // IMPORTANT: Check if your table is 'profiles' or 'users'
        const { data, error } = await supabase
            .from('user_role') 
            .select('*')
            .eq('id', user.uid)
            .single();

        if (data) {
            // Check your Supabase column names! Are they 'first_name' or 'First_Name'?
            const firstName = data.first_name || data.First_Name || "N/A";
            const lastName = data.last_name || data.Last_Name || "N/A";

            document.querySelector(".first-name").innerText = firstName;
            document.querySelector(".last-name").innerText = lastName;
            document.getElementById("displayName").innerText = `${firstName} ${lastName}`;
        } else if (error) {
            console.error("Supabase Error:", error.message);
            document.querySelector(".first-name").innerText = "Not Found";
            document.querySelector(".last-name").innerText = "Not Found";
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
