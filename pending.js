import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { auth } from "./firebase.js";

const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk"; 
const supabase = createClient(SUPABASE_URL, ANON_KEY);

// 1. Check Auth
auth.onAuthStateChanged((user) => {
  if (!user) { 
    window.location.href = "login.html"; 
    return; 
  }
  loadPending();
});

// 2. Fetch from Supabase
async function loadPending() {
  const container = document.getElementById("pendingList");
  if (!container) return;

  // We want papers where status is 'pending'
  const { data, error } = await supabase
    .from('research_papers')
    .select('*')
    .eq('status', 'pending');

  if (error) {
    console.error("Error fetching papers:", error);
    return;
  }

  container.innerHTML = "";

  if (!data || data.length === 0) {
    container.innerHTML = `<p class="empty-msg">No pending papers at the moment.</p>`;
    return;
  }

  data.forEach((paper) => {
    const row = document.createElement("div");
    row.className = "request-row";
    
    // We use the file_path to generate a temporary view link
    row.innerHTML = `
        <span class="col-user">${paper.Author || "—"}</span>
        <span class="col-title">
          <strong style="cursor:pointer; color:#6c63ff;" class="view-file" data-path="${paper.file_path}">${paper.Title}</strong>
        </span>
        <span class="col-date">${new Date(paper.created_at).toLocaleDateString()}</span>
        <span class="col-status">
          <span class="badge badge-pending">Pending</span>
        </span>
        <span class="col-actions">
          <button class="action-btn accept-btn" data-id="${paper.id}">
            <i class="fa-solid fa-check"></i> Accept
          </button>
          <button class="action-btn reject-btn" data-id="${paper.id}">
            <i class="fa-solid fa-xmark"></i> Reject
          </button>
        </span>
      `;
    container.appendChild(row);
  });

  // Attach Button Listeners
  setupButtons();
}

// 3. Update Status (Accept/Reject)
async function updateStatus(id, newStatus) {
  const { error } = await supabase
    .from('research_papers')
    .update({ status: newStatus })
    .eq('id', id);

  if (error) {
    alert("Update failed: " + error.message);
  } else {
    alert("Paper " + newStatus);
    loadPending(); // Refresh the list
  }
}

function setupButtons() {
  document.querySelectorAll(".accept-btn").forEach(btn => {
    btn.onclick = () => updateStatus(btn.dataset.id, 'published');
  });

  document.querySelectorAll(".reject-btn").forEach(btn => {
    btn.onclick = () => updateStatus(btn.dataset.id, 'rejected');
  });

  // Logic to view the PDF
  document.querySelectorAll(".view-file").forEach(item => {
    item.onclick = async () => {
      const { data } = await supabase.storage
        .from('research papers')
        .createSignedUrl(item.dataset.path, 60);
      window.open(data.signedUrl, '_blank');
    };
  });
}
