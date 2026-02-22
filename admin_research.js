import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk";
const supabase = createClient(SUPABASE_URL, ANON_KEY);

const BUCKET_ID = "research papers"; 
const STORAGE_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_ID}`;

let allPapers = []; 
let currentStatus = 'approved'; 

async function fetchResearchPapers() {
    const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .eq('status', currentStatus);

    if (error) {
        console.error("Error fetching papers:", error.message);
        return;
    }
    
    allPapers = data;
    renderAdminTable(allPapers);
}

function renderAdminTable(papers) {
    const tableBody = document.getElementById("researchTableBody");
    const resultsCount = document.getElementById("resultsCount");
    
    if (!tableBody) return;
    tableBody.innerHTML = "";

    if (resultsCount) resultsCount.innerText = `Total Managed Papers: ${papers.length}`;

    if (papers.length === 0) {
        document.getElementById("noResults").style.display = "block";
        return;
    }
    document.getElementById("noResults").style.display = "none";

    papers.forEach((paper) => {
        const rawPath = paper.file_path || "";
        const cleanPath = rawPath.startsWith('/') ? rawPath.substring(1) : rawPath;
        const finalUrl = `${STORAGE_BASE_URL}/${cleanPath}`;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <div class="admin-user-cell">
                    <strong>${paper.Author || "Unknown"}</strong><br>
                    <small>${paper.Department || "General"}</small>
                </div>
            </td>
            <td>
                <div class="admin-title-cell">
                    <a href="${finalUrl}" target="_blank" class="paper-title-link">${paper.Title || "Untitled"}</a><br>
                    <small>Year: ${paper.published_year || "N/A"}</small>
                </div>
            </td>
            <td>${paper.created_at ? new Date(paper.created_at).toLocaleDateString() : "—"}</td>
            <td><span class="status-badge ${paper.status}">${paper.status}</span></td>
            <td>
                <button class="action-btn delete" onclick="deletePaper('${paper.id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Global functions for HTML buttons
window.filterByStatus = (status) => {
    currentStatus = status;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase() === status);
    });
    fetchResearchPapers();
};

window.deletePaper = async (id) => {
    if (confirm("Permanently delete this research paper?")) {
        const { error } = await supabase.from('research_papers').delete().eq('id', id);
        if (error) alert(error.message);
        else fetchResearchPapers();
    }
};

// Search 
document.getElementById("adminSearchInput")?.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allPapers.filter(p => 
        p.Title?.toLowerCase().includes(term) || 
        p.Author?.toLowerCase().includes(term)
    );
    renderAdminTable(filtered);
});

fetchResearchPapers();
