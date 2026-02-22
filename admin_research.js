import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk";
const supabase = createClient(SUPABASE_URL, ANON_KEY);

const BUCKET_ID = "research papers"; 
const STORAGE_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_ID}`;

let allPapers = []; 
let currentStatus = 'approved'; // Default view based on your screenshot

async function fetchResearchPapers() {
    // Admins usually want to see everything, but filtered by the buttons at the top
    const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .eq('status', currentStatus);

    if (error) return console.error(error.message);
    
    allPapers = data;
    renderTable(allPapers);
}

// Render Table (Admin style)
function renderTable(papers) {
    const tableBody = document.getElementById("researchTableBody");
    if (!tableBody) return;
    tableBody.innerHTML = "";

    if (papers.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">No papers found.</td></tr>`;
        return;
    }

    papers.forEach((paper) => {
        const rawPath = paper.file_path || "";
        const cleanPath = rawPath.startsWith('/') ? rawPath.substring(1) : rawPath;
        const finalUrl = `${STORAGE_BASE_URL}/${cleanPath}`;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <div class="user-info">
                    <span class="user-name">${paper.Author || "Unknown"}</span>
                    <span class="user-dept">${paper.Department || "General"}</span>
                </div>
            </td>
            <td>
                <div class="research-info">
                    <a href="${finalUrl}" target="_blank" class="paper-link">${paper.Title || "Untitled"}</a>
                    <span class="paper-year">Year: ${paper.published_year || "N/A"}</span>
                </div>
            </td>
            <td class="date-col">${paper.created_at ? new Date(paper.created_at).toLocaleDateString() : "—"}</td>
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

// Status Tab Logic (Published, Pending, Rejected)
window.filterByStatus = (status) => {
    currentStatus = status;
    // Update button UI
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    fetchResearchPapers();
};

// Admin Delete Feature
window.deletePaper = async (id) => {
    if (confirm("Are you sure you want to remove this research paper from the repository?")) {
        const { error } = await supabase
            .from('research_papers')
            .delete()
            .eq('id', id);

        if (error) alert(error.message);
        else fetchResearchPapers();
    }
};

// Search Logic
document.getElementById("adminSearchInput")?.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allPapers.filter(p => 
        p.Title?.toLowerCase().includes(term) || 
        p.Author?.toLowerCase().includes(term)
    );
    renderTable(filtered);
});

// Initial Fetch
fetchResearchPapers();
