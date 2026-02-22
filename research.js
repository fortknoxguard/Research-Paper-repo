import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk";
const supabase = createClient(SUPABASE_URL, ANON_KEY);

const BUCKET_ID = "research papers"; 
const STORAGE_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_ID}`;

let allPapers = []; 

async function fetchResearchPapers() {
    // Only fetch papers where status is 'approved'
    const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .eq('status', 'approved');

    if (error) return console.error(error.message);
    
    allPapers = data;
    renderCards(allPapers);
}

function renderCards(papers) {
    const container = document.getElementById("researchCardsContainer");
    if (!container) return;
    container.innerHTML = "";

    const resultsCount = document.getElementById("resultsCount");
    if (resultsCount) resultsCount.innerText = `Total Research Papers: ${papers.length}`;

    if (papers.length === 0) {
        document.getElementById("noResults").style.display = "block";
        return;
    }
    document.getElementById("noResults").style.display = "none";

    papers.forEach((paper) => {
        const rawPath = paper.file_path || "";
        const cleanPath = rawPath.startsWith('/') ? rawPath.substring(1) : rawPath;
        const finalUrl = rawPath.startsWith('http') ? rawPath : `${STORAGE_BASE_URL}/${cleanPath}`;

        const card = document.createElement("div");
        card.className = "paper-card"; 
        card.onclick = () => window.open(finalUrl, '_blank');

        card.innerHTML = `
            <div class="paper-preview">
                <img src="cat-2.jpg" class="preview-img" alt="Paper Preview">
                <div class="pdf-overlay-icon"><i class="fa-solid fa-file-pdf"></i></div>
            </div>
            <h3 class="paper-title">${paper.Title || "Untitled Research"}</h3>
            <p class="paper-meta">By ${paper.Author || "Unknown Author"}</p>
            <div class="paper-tags">
                <span class="tag">${paper.Department || "General"}</span>
                <span class="tag">${paper.published_year || "No Year"}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- SEARCH LOGIC ---
document.getElementById("searchInput")?.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allPapers.filter(p => 
        p.Title?.toLowerCase().includes(term) || 
        p.Author?.toLowerCase().includes(term)
    );
    renderCards(filtered);
});

// --- FILTER LOGIC (FIXED) ---
window.setFilter = (type, value) => {
    let filtered = allPapers;
    
    if (value !== 'ALL') {
        // FIXED: Column mapping to match your Supabase Screenshot
        const column = (type === 'year') ? 'published_year' : 'Department';
        filtered = allPapers.filter(p => String(p[column]) === String(value));
    }
    
    renderCards(filtered);

    // Update UI labels
    const labelId = type === 'year' ? 'yearLabel' : 'deptLabel';
    const labelElement = document.getElementById(labelId);
    if (labelElement) {
        labelElement.innerText = (value === 'ALL') ? `ALL ${type.toUpperCase()}S` : value;
    }
    
    // Close dropdown after selection
    const dropId = type === 'year' ? 'yearDrop' : 'deptDrop';
    document.getElementById(dropId)?.classList.remove("show");
};

window.toggleDrop = (id) => {
    document.getElementById(id).classList.toggle("show");
};

// Close dropdowns if user clicks outside
window.onclick = function(event) {
  if (!event.target.matches('.drop-btn')) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      if (dropdowns[i].classList.contains('show')) {
        dropdowns[i].classList.remove('show');
      }
    }
  }
}

fetchResearchPapers();
