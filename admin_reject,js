import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk";
const supabase = createClient(SUPABASE_URL, ANON_KEY);

const STORAGE_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/research papers`;

async function loadRejected() {
    const container = document.getElementById("requestList");
    if (!container) return;

    // Fetch papers specifically marked as 'rejected'
    const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .eq('status', 'rejected');

    if (error) {
        console.error("Error loading rejected papers:", error.message);
        return;
    }

    container.innerHTML = "";

    if (!data || data.length === 0) {
        container.innerHTML = `<p class="empty-msg">No rejected papers.</p>`;
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
                <span class="badge badge-rejected">Rejected</span>
            </span>
            <span class="col-actions">
                <button class="action-btn delete-btn" onclick="deleteEntry('${paper.id}')">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </span>
        `;
        container.appendChild(row);
    });
}

// Optional: Allow Admin to permanently delete a rejected entry
window.deleteEntry = async (id) => {
    if (confirm("Permanently delete this rejected record?")) {
        const { error } = await supabase
            .from('research_papers')
            .delete()
            .eq('id', id);

        if (error) alert("Error deleting: " + error.message);
        else loadRejected();
    }
};

document.addEventListener("DOMContentLoaded", loadRejected);
