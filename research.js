// js/research.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk";
const supabase = createClient(SUPABASE_URL, ANON_KEY);

// FIXED: Handles the space in "research papers" correctly for the URL
const BUCKET_NAME = "research papers"; 
const STORAGE_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(BUCKET_NAME)}/`;

async function fetchResearchPapers() {
    // 1. Fetch ALL papers from the table
    const { data, error } = await supabase
        .from('research_papers')
        .select('*');

    if (error) {
        console.error("Supabase Error:", error.message);
        return;
    }

    // 2. Filter manually to ensure 'approved' matches regardless of capitalization
    const published = data.filter(p => 
        p.status && p.status.trim().toLowerCase() === 'approved'
    );

    renderCards(published);
}

function renderCards(papers) {
    const container = document.getElementById("researchCardsContainer");
    if (!container) return;
    container.innerHTML = "";

    if (papers.length === 0) {
        container.innerHTML = `<p class="empty-msg">No approved research papers found.</p>`;
        return;
    }

    papers.forEach((paper) => {
        // MATCHING YOUR TABLE SETUP (using common variations for safety)
        const title = paper.Title || paper.title || "Untitled";
        const author = paper.Author || paper.author || "Unknown Author";
        const year = paper.Year || paper.year || "2024";
        const dept = paper.Department || paper.department || "General";
        
        // Construct the full URL for the file
        const rawPath = paper.file_path || paper.file_url || "";
        const finalUrl = rawPath.startsWith('http') 
            ? rawPath 
            : (rawPath ? STORAGE_BASE_URL + rawPath : "#");

        const card = document.createElement("div");
        card.className = "research-card";
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

fetchResearchPapers();
