import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk";
const supabase = createClient(SUPABASE_URL, ANON_KEY);

// CONFIRMED BUCKET ID: uses hyphen based on your working URL
const BUCKET_ID = "research papers"; 
const STORAGE_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_ID}`;

async function fetchResearchPapers() {
    console.log("Fetching papers...");
    const { data, error } = await supabase
        .from('research_papers')
        .select('*');

    if (error) {
        console.error("Database Error:", error.message);
        return;
    }

    renderCards(data);
}

function renderCards(papers) {
    const container = document.getElementById("researchCardsContainer");
    if (!container) return;
    
    container.innerHTML = "";

    // Update results count
    const resultsCount = document.getElementById("resultsCount");
    if (resultsCount) {
        resultsCount.innerText = `Total Research Papers: ${papers.length}`;
    }

    if (!papers || papers.length === 0) {
        document.getElementById("noResults").style.display = "block";
        return;
    } else {
        document.getElementById("noResults").style.display = "none";
    }

    papers.forEach((paper) => {
        const rawPath = paper.file_path || paper.file_url || "";
        const cleanPath = rawPath.startsWith('/') ? rawPath.substring(1) : rawPath;
        const finalUrl = rawPath.startsWith('http') 
            ? rawPath 
            : `${STORAGE_BASE_URL}/${cleanPath}`;

        const card = document.createElement("div");
        // Using your original CSS class
        card.className = "research-card"; 
        
        card.innerHTML = `
            <div class="card-content" onclick="window.open('${finalUrl}', '_blank')">
                <div class="pdf-icon-top">
                    <i class="fa-solid fa-file-pdf"></i>
                </div>
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

fetchResearchPapers();
