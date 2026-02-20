import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


const SUPABASE_URL    = "https://tgciqknubmwinyykuuve.supabase.co";         
const SUPABASE_KEY    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk";          
const BUCKET_NAME     = "research papers";                                  
const UPLOAD_FOLDER   = "pending";                                          

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


const realFile    = document.getElementById("real-file");
const customBtn   = document.getElementById("custom-button");
const customText  = document.getElementById("custom-text");

customBtn.addEventListener("click", () => realFile.click());
realFile.addEventListener("change", () => {
  const file = realFile.files[0];
  customText.textContent = file ? file.name : "No file chosen, yet.";
});

const form        = document.querySelector(".upload-form");
const confirmBtn  = document.querySelector(".confirm-btn");
const progressBox = document.getElementById("progress-box");
const progressBar = document.getElementById("progress-fill");
const progressPct = document.getElementById("progress-pct");
const messageEl   = document.getElementById("upload-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get current user (using Supabase auth — adjust if you still use Firebase auth)
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    showMessage("You must be logged in to upload.", "error");
    window.location.href = "index.html";
    return;
  }

  const inputs     = form.querySelectorAll(".custom-input");
  const title      = inputs[0].value.trim();
  const authors    = inputs[1].value.trim();
  const department = inputs[2].value;
  const schoolYear = inputs[3].value;
  const file       = realFile.files[0];

  if (!title || !authors || !department || !schoolYear || !file) {
    showMessage("Please fill in all fields and choose a file.", "error");
    return;
  }

  hideMessage();
  confirmBtn.disabled = true;
  confirmBtn.textContent = "Uploading...";
  progressBox.style.display = "block";
  progressPct.textContent = "0%";
  progressBar.style.width = "0%";

  try {

    const fileExt  = file.name.split('.').pop();
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${UPLOAD_FOLDER}/${user.id}/${fileName}`;


    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,             
        contentType: file.type
      });

    if (uploadError) {
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }


    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    const fileURL = urlData.publicUrl;


    const { error: dbError } = await supabase
      .from("research")
      .insert({
        title,
        authors,
        department,
        school_year: schoolYear,   
        file_url: fileURL,
        file_name: file.name,
        uploaded_by: user.user_metadata?.full_name || user.email,
        user_id: user.id,
        status: "pending",
        created_at: new Date().toISOString()
      });

    if (dbError) {

      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
      throw new Error(`Database save failed: ${dbError.message}`);
    }


    progressBar.style.width = "100%";
    progressPct.textContent = "100%";

    setTimeout(() => {
      progressBox.style.display = "none";
      showMessage("Research submitted! It is now pending review.", "success");
      form.reset();
      customText.textContent = "No file chosen, yet.";
      confirmBtn.disabled = false;
      confirmBtn.textContent = "Confirm & Submit";
    }, 800);

  } catch (err) {
    console.error("Upload error:", err);
    progressBox.style.display = "none";
    showMessage("Upload failed: " + (err.message || "Unknown error"), "error");
    confirmBtn.disabled = false;
    confirmBtn.textContent = "Confirm & Submit";
  }
});

function showMessage(msg, type) {
  messageEl.textContent = msg;
  messageEl.style.display = "block";
  messageEl.style.color = type === "success" ? "#155724" : "#721c24";
  messageEl.style.backgroundColor = type === "success" ? "#d4edda" : "#f8d7da";
  messageEl.style.border = `1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"}`;
}

function hideMessage() {
  messageEl.style.display = "none";
}
