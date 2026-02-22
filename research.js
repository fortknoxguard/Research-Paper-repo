// js/research.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk";
const supabase = createClient(SUPABASE_URL, ANON_KEY);

// THE GLUE: This is the base path to your Supabase files
const STORAGE_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/research-files/`;

async function fetchResearchPapers() {
    const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .eq('status', 'approved'); // Only show published papers

    if (error) {
        console.error("Error fetching papers:", error.message);
        return;
    }

    renderCards(data);
}

function renderCards(papers) {
    const container = document.getElementById("researchCardsContainer");
    if (!container) return;
    container.innerHTML = "";

    papers.forEach((paper) => {
        // MATCHING YOUR TABLE SETUP
        const title = paper.Title || paper.title || "Untitled";
        const author = paper.Author || paper.author || "Unknown Author";
        const year = paper.Year || paper.year || "2024";
        const dept = paper.Department || paper.department || "General";
        
        // THE FIX: Construct the full URL if it's just a filename
        const rawPath = paper.file_path || paper.file_url || "";
        const finalUrl = rawPath.startsWith('http') 
            ? rawPath 
            : (rawPath ? STORAGE_BASE_URL + rawPath : "#");

        const card = document.createElement("div");
        card.className = "research-card";
        
        // Making the whole card clickable to the file
        card.innerHTML = `
            <div class="card-content" onclick="window.open('${finalUrl}', '_blank')">
                <div class="pdf-icon-top"><i class="fa-solid fa-file-pdf"></i></div>
                <h3 class="card-title">${title}</h3>
                <p class="card-author">Authors: ${author}</p>
                <div class="card-tags">
                    <span class="tag-dept">${dept}</span>
                    <span class="tag-year">${year}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Initial Load
fetchResearchPapers();
