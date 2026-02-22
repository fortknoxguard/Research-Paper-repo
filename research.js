research.js


import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk";
const supabase = createClient(SUPABASE_URL, ANON_KEY);

let selectedYear = "ALL";
let selectedDept = "ALL";

window.onload = fetchApprovedPapers;

async function fetchApprovedPapers() {
    // Note: Ensure you have a 'status' column in your table with 'approved' rows
    const { data, error } = await supabase
        .from('research_papers')
        .select('*')
        .eq('status', 'approved'); 

    if (error) {
        console.error("Supabase Error:", error.message);
        return;
    }
    console.log("Data fetched:", data); // Check F12 console to see if data arrived
    renderPapers(data);
}

function renderPapers(papers) {
    const container = document.getElementById("researchGrid");
    if (!container) return;
    container.innerHTML = "";

    papers.forEach(paper => {
        const card = document.createElement("div");
        card.className = "paper-card";
        
        // MATCHING YOUR TABLE SETUP: Using Capitalized Keys
        const title = paper.Title || paper.title || "Untitled";
        const author = paper.Author || paper.author || "Unknown Author";
        const year = paper.Year || paper.year || "2024";
        const dept = paper.Department || paper.department || "General";
        const url = paper.file_path || paper.file_url || "#";

        card.setAttribute("data-year", year);
        card.setAttribute("data-dept", dept);

        card.innerHTML = `
            <div class="paper-preview">
                <img src="../img/icct.jpeg" alt="Thumbnail" class="preview-img" onerror="this.src='https://via.placeholder.com/150'">
                <i class="fa-solid fa-file-pdf pdf-overlay-icon"></i>
            </div>
            <div class="paper-info">
                <h3 class="paper-title">${title}</h3>
                <p class="paper-meta">Authors: ${author}</p>
                <div class="paper-tags">
                    <span class="tag">${dept}</span>
                    <span class="tag">${year}</span>
                </div>
            </div>
        `;

        card.onclick = () => {
            if (url !== "#") window.open(url, '_blank');
            else alert("No file path found for this paper.");
        };

        container.appendChild(card);
    });

    window.filterPapers();
}

window.toggleDrop = (id) => {
    document.querySelectorAll('.dropdown-content').forEach(d => {
        if (d.id !== id) d.classList.remove('show');
    });
    document.getElementById(id).classList.toggle("show");
};

window.setFilter = (type, value) => {
    if (type === 'year') {
        selectedYear = value;
        document.getElementById('yearLabel').innerText = value === 'ALL' ? "ALL YEARS" : value;
    } else {
        selectedDept = value;
        document.getElementById('deptLabel').innerText = value === 'ALL' ? "ALL DEPARTMENTS" : value;
    }
    document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show'));
    window.filterPapers();
};

window.filterPapers = () => {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.paper-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const title = card.querySelector('.paper-title').innerText.toLowerCase();
        const author = card.querySelector('.paper-meta').innerText.toLowerCase();
        const cardYear = card.getAttribute('data-year');
        const cardDept = card.getAttribute('data-dept');

        const matchesSearch = title.includes(searchInput) || author.includes(searchInput);
        const matchesYear = (selectedYear === "ALL" || cardYear === selectedYear);
        const matchesDept = (selectedDept === "ALL" || cardDept === selectedDept);

        const isVisible = matchesSearch && matchesYear && matchesDept;
        card.style.display = isVisible ? "block" : "none";
        if (isVisible) visibleCount++;
    });

    document.getElementById('resultsCount').innerText = `Total Research Papers: ${visibleCount}`;
    const noResults = document.getElementById('noResults');
    if (noResults) noResults.style.display = visibleCount === 0 ? "block" : "none";
};

// Search event listener
document.getElementById('searchInput')?.addEventListener('input', window.filterPapers);
