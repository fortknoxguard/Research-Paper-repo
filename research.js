import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk";
const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function fetchResearchPapers() {
    // This pulls EVERYTHING without any 'approved' filter
    const { data, error } = await supabase
        .from('research_papers')
        .select('*');

    if (error) {
        console.error("Fetch error:", error.message);
        return;
    }

    console.log("Database response:", data);
    renderCards(data);
}

function renderCards(papers) {
    const container = document.getElementById("researchCardsContainer");
    if (!container) return;
    container.innerHTML = "";

    if (!papers || papers.length === 0) {
        container.innerHTML = "<p>No data returned from Supabase.</p>";
        return;
    }

    papers.forEach((paper) => {
        const card = document.createElement("div");
        card.className = "research-card";
        
        // This uses the raw path from your table
        const fileUrl = paper.file_path || "#";

        card.innerHTML = `
            <div class="card-content" onclick="window.open('${fileUrl}', '_blank')">
                <h3 class="card-title">${paper.Title || "Untitled"}</h3>
                <p>Status: ${paper.status}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

fetchResearchPapers();
