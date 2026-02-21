import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { auth } from "./firebase.js";

const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk";
const supabase = createClient(SUPABASE_URL, ANON_KEY);

let userRole = 'student'; 

auth.onAuthStateChanged(async (user) => {
    if (!user) { 
        window.location.href = "login.html"; 
        return; 
    }

    // Role Check Logic: Handles the 406 error by treating roleData as an array
    const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.uid);

    if (roleData && roleData.length > 0) {
        userRole = roleData[0].role; // Get the role from the first object in the array
    } else {
        userRole = 'student'; // Fallback if no role is assigned in DB
    }

    loadPending();
});

async function loadPending() {
    const container = document.getElementById("pendingList");
    if (!container) return;

    const currentUser = auth.currentUser;
    if (!currentUser) return;

    let query = supabase
        .from('research_papers')
        .select('*')
        .eq('status', 'pending');

    // Filter: Admins see everything, Students see only their own
    if (userRole !== 'admin') {
        // NOTE: Ensure your table has a 'user_id' column matching the Firebase UID
        query = query.eq('user_id', currentUser.uid);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Supabase Error:", error.message);
        return;
    }

    container.innerHTML = "";

    if (!data || data.length === 0) {
        container.innerHTML = `<p class="empty-msg">No pending papers found.</p>`;
        return;
    }

    data.forEach((paper) => {
        const row = document.createElement("div");
        row.className = "request-row";

        const dateRaw = paper.created_at;
        const displayDate = (dateRaw && !isNaN(Date.parse(dateRaw))) 
            ? new Date(dateRaw).toLocaleDateString() 
            : "Awaiting Sync";

        let actionHTML = '';
        if (userRole === 'admin') {
            actionHTML = `
                <button class="action-btn accept-btn" data-id="${paper.id}">Accept</button>
                <button class="action-btn reject-btn" data-id="${paper.id}">Reject</button>
            `;
        } else {
            actionHTML = `<span class="badge-view-only">Under Review</span>`;
        }

        row.innerHTML = `
            <span class="col-user">${paper.Author || "Student"}</span>
            <span class="col-title" style="cursor:pointer; color:#00abff;" onclick="window.open('${paper.file_path}', '_blank')">
                ${paper.Title || "Untitled"}
            </span>
            <span class="col-date">${displayDate}</span>
            <span class="col-status"><span class="badge badge-pending">Pending</span></span>
            <span class="col-actions">${actionHTML}</span>
        `;
        container.appendChild(row);
    });

    // Re-attach listeners for Admins
    if (userRole === 'admin') {
        container.querySelectorAll(".accept-btn").forEach(btn => {
            btn.onclick = () => updateStatus(btn.dataset.id, 'approved');
        });
        container.querySelectorAll(".reject-btn").forEach(btn => {
            btn.onclick = () => updateStatus(btn.dataset.id, 'rejected');
        });
    }
}

async function updateStatus(id, newStatus) {
    if (userRole !== 'admin') return; 

    const { error } = await supabase
        .from('research_papers')
        .update({ status: newStatus })
        .eq('id', parseInt(id));

    if (error) {
        alert("Update failed: " + error.message);
    } else {
        alert(`Paper successfully ${newStatus}!`);
        loadPending();
    }
}
