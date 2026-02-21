import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { auth } from "./firebase.js";

const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk";
const supabase = createClient(SUPABASE_URL, ANON_KEY);

auth.onAuthStateChanged(async (user) => {
    if (!user) { 
        window.location.href = "login.html"; 
        return; 
    }
    loadPending();
});

async function loadPending() {
    const container = document.getElementById("pendingList");
    if (!container) return;

    const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .eq('status', 'pending');

    if (error) {
        console.error("Supabase Error:", error.message);
        return;
    }

    container.innerHTML = "";

    if (!data || data.length === 0) {
        container.innerHTML = `<p class="empty-msg">No pending papers at the moment.</p>`;
        return;
    }

    data.forEach((paper) => {
        const row = document.createElement("div");
        row.className = "request-row";

        // FIX: Handle "Invalid Date" for older rows with NULL created_at
        const dateRaw = paper.created_at;
        const displayDate = (dateRaw && !isNaN(Date.parse(dateRaw))) 
            ? new Date(dateRaw).toLocaleDateString() 
            : "Awaiting Sync";

        row.innerHTML = `
            <span class="col-user">${paper.Author || "Unknown"}</span>
            <span class="col-title">${paper.Title || "Untitled"}</span>
            <span class="col-date">${displayDate}</span>
            <span class="col-status"><span class="badge badge-pending">Pending</span></span>
            <span class="col-actions">
                <button class="action-btn accept-btn" data-id="${paper.id}">Accept</button>
                <button class="action-btn reject-btn" data-id="${paper.id}">Reject</button>
            </span>
        `;
        container.appendChild(row);
    });

    // FIX: Change to Capitalized strings to satisfy database constraints
    container.querySelectorAll(".accept-btn").forEach(btn => {
        btn.onclick = () => updateStatus(btn.dataset.id, 'Published');
    });
    
    container.querySelectorAll(".reject-btn").forEach(btn => {
        btn.onclick = () => updateStatus(btn.dataset.id, 'Rejected');
    });
}

async function updateStatus(id, newStatus) {
    const { error } = await supabase
        .from('research_papers')
        .update({ status: newStatus })
        .eq('id', id);

    if (error) {
        console.error("Full Error Object:", error);
        alert("Update failed: " + error.message);
    } else {
        alert(`Paper successfully ${newStatus}!`);
        loadPending(); 
    }
}
