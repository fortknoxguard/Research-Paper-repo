import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk";
const supabase = createClient(SUPABASE_URL, ANON_KEY);

const STORAGE_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/research papers`;

async function loadPending() {
    const container = document.getElementById("requestList");
    if (!container) return;

    // Fetch all pending papers from Supabase
    const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .eq('status', 'pending');

    if (error) {
        console.error("Error loading pending requests:", error.message);
        return;
    }

    container.innerHTML = "";

    if (!data || data.length === 0) {
        container.innerHTML = `<p class="empty-msg">No pending papers at the moment.</p>`;
        return;
    }

    data.forEach((paper) => {
        const cleanPath = paper.file_path.startsWith('/') ? paper.file_path.substring(1) : paper.file_path;
        const finalUrl = `${STORAGE_BASE_URL}/${cleanPath}`;
        const date = paper.created_at ? new Date(paper.created_at).toLocaleDateString() : "—";

        const row = document.createElement("div");
        row.className = "request-row";
        row.innerHTML = `
            <span class="col-user">${paper.Author || "—"}</span>
            <span class="col-title">
                <a href="${finalUrl}" target="_blank">${paper.Title || "Untitled"}</a>
            </span>
            <span class="col-date">${date}</span>
            <span class="col-status">
                <span class="badge badge-pending">Pending</span>
            </span>
            <span class="col-actions">
                <button class="action-btn accept-btn" data-id="${paper.id}">
                    <i class="fa-solid fa-check"></i> Accept
                </button>
                <button class="action-btn reject-btn" data-id="${paper.id}">
                    <i class="fa-solid fa-xmark"></i> Reject
                </button>
            </span>
        `;
        container.appendChild(row);
    });

    // Add Event Listeners
    container.querySelectorAll(".accept-btn").forEach((btn) =>
        btn.addEventListener("click", () => updateStatus(btn.dataset.id, "approved"))
    );
    container.querySelectorAll(".reject-btn").forEach((btn) =>
        btn.addEventListener("click", () => updateStatus(btn.dataset.id, "rejected"))
    );
}

async function updateStatus(id, newStatus) {
    try {
        const { error } = await supabase
            .from('research_papers')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) throw error;

        alert(`Paper ${newStatus === 'approved' ? 'Accepted' : 'Rejected'}!`);
        loadPending(); // Refresh list
    } catch (err) {
        alert("Could not update status. Please try again.");
    }
}

// Start loading when page is ready
document.addEventListener("DOMContentLoaded", loadPending);
