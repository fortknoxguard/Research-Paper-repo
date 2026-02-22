import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk";
const supabase = createClient(SUPABASE_URL, ANON_KEY);

// THE GLUE: Handles the space in "research papers"
const BUCKET_NAME = "research-papers";
const STORAGE_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(BUCKET_NAME)}/`;

async function fetchResearchPapers() {
    console.log("Fetching papers...");
    
    const { data, error } = await supabase
        .from('research_papers')
        .select('*');

    if (error) {
        console.error("Database Error:", error.message);
        return;
    }

    console.log("Papers received from DB:", data);
    renderCards(data);
}

function renderCards(papers) {
    const container = document.getElementById("researchCardsContainer");
    
    if (!container) {
        console.error("CRITICAL: Element #researchCardsContainer not found in HTML!");
        alert("Developer Error: HTML container missing!");
        return;
    }

    container.innerHTML = "";

    if (!papers || papers.length === 0) {
        container.innerHTML = "<p>No research papers found in the database.</p>";
        return;
    }

    papers.forEach((paper) => {
        // Construct the URL to the PDF
        const rawPath = paper.file_path || paper.file_url || "";
        const finalUrl = rawPath.startsWith('http') 
            ? rawPath 
            : (rawPath ? STORAGE_BASE_URL + rawPath : "#");

        const card = document.createElement("div");
        card.className = "research-card";
        
        // Match the keys exactly as seen in your console log (Title, Author)
        card.innerHTML = `
            <div class="card-content" onclick="window.open('${finalUrl}', '_blank')" style="cursor:pointer;">
                <div class="pdf-icon-top"><i class="fa-solid fa-file-pdf"></i></div>
                <h3 class="card-title">${paper.Title || "Untitled"}</h3>
                <p class="card-author">Author: ${paper.Author || "Unknown"}</p>
                <div class="card-tags">
                    <span class="tag-dept">${paper.Department || "General"}</span>
                    <span class="tag-year">${paper.Year || "2026"}</span>
                </div>
                <p style="font-size: 0.7rem; color: gray;">Status: ${paper.status || 'none'}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// Start the process
fetchResearchPapers();
