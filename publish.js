// js/publish.js
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

    // Get User Role
    const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.uid);

    if (roleData && roleData.length > 0) {
        userRole = roleData[0].role;
    }

    // Load "approved" papers into the "publishedList" container
    loadPapers("approved", "publishedList");
});

async function loadPapers(status, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const user = auth.currentUser;

    // Start Supabase Query
    let query = supabase
        .from('research_papers')
        .select('*')
        .eq('status', status);

    // If student, only show their own
    if (userRole !== 'admin') {
        query = query.eq('user_id', user.uid);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Supabase Error:", error.message);
        return;
    }

    container.innerHTML = "";

    if (!data || data.length === 0) {
        container.innerHTML = `<p class="empty-msg">No ${status} papers found.</p>`;
        return;
    }

    data.forEach((paper) => {
        // Format the date
        const dateRaw = paper.created_at;
        const displayDate = (dateRaw && !isNaN(Date.parse(dateRaw))) 
            ? new Date(dateRaw).toLocaleDateString() 
            : "—";

        const row = document.createElement("div");
        row.className = "request-row";
        
        // Map table columns: Title, Author, file_path
        row.innerHTML = `
            <span class="col-user">${paper.Author || "Unknown"}</span>
            <span class="col-title">
                <a href="${paper.file_path || '#'}" target="_blank">${paper.Title || "Untitled"}</a>
            </span>
            <span class="col-date">${displayDate}</span>
            <span class="col-status">
                <span class="badge badge-published">Published</span>
            </span>
        `;
        container.appendChild(row);
    });
}
