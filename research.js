import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk";
const supabase = createClient(SUPABASE_URL, ANON_KEY);

const BUCKET_ID = "research papers"; 
const STORAGE_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_ID}`;

let allPapers = []; 

async function fetchResearchPapers() {
    const { data, error } = await supabase.from('research_papers').select('*');
    if (error) return console.error(error.message);
    
    allPapers = data;
    renderCards(allPapers);
}

function renderCards(papers) {
    const container = document.getElementById("researchCardsContainer");
    const resultsCount = document.getElementById("resultsCount");
    const noResults = document.getElementById("noResults");
    
    if (!container) return;
    container.innerHTML = "";

    if (resultsCount) resultsCount.innerText = `Total Research Papers: ${papers.length}`;

    if (papers.length === 0) {
        if (noResults) noResults.style.display = "block";
        return;
    }
    if (noResults) noResults.style.display = "none";

    papers.forEach((paper) => {
        const rawPath = paper.file_path || paper.file_url || "";
        const cleanPath = rawPath.startsWith('/') ? rawPath.substring(1) : rawPath;
        const finalUrl = rawPath.startsWith('http') ? rawPath : `${STORAGE_BASE_URL}/${cleanPath}`;

        const card = document.createElement("div");
        card.className = "research-card";
        card.innerHTML = `
            <div class="card-content" onclick="window.open('${finalUrl}', '_blank')">
                <div class="pdf-icon-top"><i class="fa-solid fa-file-pdf"></i></div>
                <h3 class="card-title">${paper.Title || "Untitled"}</h3>
                <p class="card-author">Author: ${paper.Author || "Unknown"}</p>
                <div class="card-tags">
                    <span class="tag-dept">${paper.Department || "General"}</span>
                    <span class="tag-year">${paper.Year || "2026"}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- SEARCH & FILTER LOGIC ---
document.getElementById("searchInput")?.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allPapers.filter(p => 
        p.Title?.toLowerCase().includes(term) || 
        p.Author?.toLowerCase().includes(term)
    );
    renderCards(filtered);
});

window.setFilter = (type, value) => {
    let filtered = allPapers;
    if (value !== 'ALL') {
        filtered = allPapers.filter(p => p[type === 'year' ? 'Year' : 'Department'] == value);
    }
    renderCards(filtered);
    // Update UI labels
    const labelId = type === 'year' ? 'yearLabel' : 'deptLabel';
    document.getElementById(labelId).innerText = value === 'ALL' ? `ALL ${type.toUpperCase()}S` : value;
};

window.toggleDrop = (id) => {
    document.getElementById(id).classList.toggle("show");
};

fetchResearchPapers();
