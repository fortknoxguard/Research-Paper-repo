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
    renderAdminGrid(allPapers);
}

function renderAdminGrid(papers) {
    const gridContainer = document.getElementById("researchGrid");
    const resultsCount = document.getElementById("resultsCount");
    const noResults = document.getElementById("noResults");
    
    if (!gridContainer) return;
    gridContainer.innerHTML = "";

    if (resultsCount) resultsCount.innerText = `Total Managed Papers: ${papers.length}`;

    if (papers.length === 0) {
        if (noResults) noResults.style.display = "block";
        return;
    }
    if (noResults) noResults.style.display = "none";

    papers.forEach((paper) => {
        const rawPath = paper.file_path || "";
        const cleanPath = rawPath.startsWith('/') ? rawPath.substring(1) : rawPath;
        const finalUrl = `${STORAGE_BASE_URL}/${cleanPath}`;

        const card = document.createElement("div");
        card.className = "paper-card";
        
        // We use the same structure as the student page cards
        card.innerHTML = `
            <div class="paper-preview" onclick="window.open('${finalUrl}', '_blank')">
                <img src="icct.jpeg" alt="Paper Thumbnail" class="preview-img">
                <div class="pdf-icon-overlay">
                    <i class="fa-solid fa-file-pdf"></i>
                </div>
            </div>
            <div class="paper-info">
                <h3 class="paper-title">${paper.Title || "Untitled"}</h3>
                <p class="paper-meta">By ${paper.Author || "Unknown Author"}</p>
                <div class="card-tags">
                    <span class="tag">${paper.Department || "General"}</span>
                    <span class="tag">${paper.published_year || "No Year"}</span>
                </div>
            </div>
            <div class="admin-actions">
                <button class="delete-btn" onclick="deletePaper('${paper.id}')" title="Delete Permanent">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

// Global functions for UI interaction
window.filterByStatus = (status) => {
    currentStatus = status;
    
    // Update Active Tab UI
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.id === `tab-${status}`);
    });

    fetchResearchPapers();
};

window.deletePaper = async (id) => {
    if (confirm("Permanently delete this research paper from the database? This cannot be undone.")) {
        const { error } = await supabase.from('research_papers').delete().eq('id', id);
        if (error) {
            alert("Error: " + error.message);
        } else {
            fetchResearchPapers();
        }
    }
};

// Search Logic
document.getElementById("adminSearchInput")?.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allPapers.filter(p => 
        p.Title?.toLowerCase().includes(term) || 
        p.Author?.toLowerCase().includes(term) ||
        p.Department?.toLowerCase().includes(term)
    );
    renderAdminGrid(filtered);
});

// Dropdown Filters
window.setFilter = (type, value) => {
    let filtered = [...allPapers];
    
    if (type === 'year' && value !== 'ALL') {
        filtered = allPapers.filter(p => p.published_year == value);
        document.getElementById('yearLabel').innerText = value;
    } else if (type === 'dept' && value !== 'ALL') {
        filtered = allPapers.filter(p => p.Department == value);
        document.getElementById('deptLabel').innerText = value;
    } else {
        if (type === 'year') document.getElementById('yearLabel').innerText = "ALL YEARS";
        if (type === 'dept') document.getElementById('deptLabel').innerText = "ALL DEPARTMENTS";
    }

    renderAdminGrid(filtered);
};

// Initialize
fetchResearchPapers();
