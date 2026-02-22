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

    if (error) return console.error(error.message);
    
    allPapers = data;
    renderAdminCards(allPapers);
}

function renderAdminCards(papers) {
    const container = document.getElementById("researchCardsContainer");
    if (!container) return;
    container.innerHTML = "";

    const resultsCount = document.getElementById("resultsCount");
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

        const card = document.createElement("div");
        card.className = "paper-card"; 

        card.innerHTML = `
            <div class="paper-preview" onclick="window.open('${finalUrl}', '_blank')">
                <img src="cat-2.jpg" class="preview-img" alt="Paper Preview">
                <div class="pdf-overlay-icon"><i class="fa-solid fa-file-pdf"></i></div>
            </div>
            <h3 class="paper-title">${paper.Title || "Untitled Research"}</h3>
            <p class="paper-meta">By ${paper.Author || "Unknown Author"}</p>
            <div class="paper-tags">
                <span class="tag">${paper.Department || "General"}</span>
                <span class="tag">${paper.published_year || "No Year"}</span>
            </div>
            <div class="admin-actions">
                <button class="delete-btn" onclick="deletePaper('${paper.id}')">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

window.filterByStatus = (status) => {
    currentStatus = status;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.id === `tab-${status}`);
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

document.getElementById("adminSearchInput")?.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allPapers.filter(p => 
        p.Title?.toLowerCase().includes(term) || 
        p.Author?.toLowerCase().includes(term)
    );
    renderAdminCards(filtered);
});

fetchResearchPapers();
