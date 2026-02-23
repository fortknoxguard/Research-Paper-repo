import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { supabase } from "./supabaseClient.js"; // Added the missing import

onAuthStateChanged(auth, (user) => {
  if (user) {
    const displayName = user.displayName || user.email.split("@")[0];
    const greetingEl = document.getElementById("user-greeting");
    if (greetingEl) {
      greetingEl.textContent = `Welcome, ${displayName}!`;
    }

    // Call the dynamic count function here
    updatePaperCount();

  } else {
    window.location.href = "index.html";
  }
});

// Function to fetch the real count from Supabase
async function updatePaperCount() {
    try {
        const { count, error } = await supabase
            .from('research_papers')
            .select('*', { count: 'exact', head: true }) 
            .eq('status', 'approved');

        if (error) throw error;

        const countEl = document.getElementById('total-approved-count');
        if (countEl) countEl.innerText = count || 0;
        
    } catch (err) {
        console.error("DEBUG ERROR:", err.message);
        // This will tell you if the table name is wrong or connection failed
        document.getElementById('total-approved-count').innerText = "Error";
    }
}
