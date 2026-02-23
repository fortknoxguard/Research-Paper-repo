import { auth } from "firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    const displayName = user.displayName || user.email.split("@")[0];
    const greetingEl = document.getElementById("user-greeting");
    if (greetingEl) {
      greetingEl.textContent = `Welcome, ${displayName}!`;
    }
  } else {
    window.location.href = "index.html";
  }
});




async function updatePaperCount() {
    const { count, error } = await supabase
        .from('research_papers')
        .select('*', { count: 'exact', head: true }) 
        .eq('status', 'approved');

    if (error) {
        console.error("Error fetching count:", error.message);
        document.getElementById('total-approved-count').innerText = "0";
        return;
    }

 
    document.getElementById('total-approved-count').innerText = count;
}



document.addEventListener("DOMContentLoaded", updatePaperCount);
