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
    const { count, error } = await supabase
        .from('research_papers')
        .select('*', { count: 'exact', head: true }) 
        .eq('status', 'approved');

    if (error) {
        console.error("Error fetching count:", error.message);
        const countEl = document.getElementById('total-approved-count');
        if (countEl) countEl.innerText = "0";
        return;
    }

    const countEl = document.getElementById('total-approved-count');
    if (countEl) {
        countEl.innerText = count;
    }
}
