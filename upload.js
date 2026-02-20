// js/upload.js
// Complete upload logic with Supabase Storage + Database + file chooser
// Using Firebase for authentication check (Option A)

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Adjust this import path if your firebase file has a different name
import { auth } from "./firebase.js";  // ← should be firebase.js in the same folder

// ── Supabase Configuration ────────────────────────────────────────────────
const SUPABASE_URL    = "https://tgciqknubmwinyykuuve.supabase.co";
const SUPABASE_KEY    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk";
const BUCKET_NAME     = "research papers";      // ← rename to "research-papers" in Supabase dashboard!
const UPLOAD_FOLDER   = "pending";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Wait for DOM to be ready ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded → DOM is ready");
  console.log("Firebase auth object:", auth ? "exists" : "MISSING - check import from firebase.js");

  // ── File chooser elements ───────────────────────────────────────────────
  const realFile    = document.getElementById("real-file");
  const customBtn   = document.getElementById("custom-button");
  const customText  = document.getElementById("custom-text");

  // ── Form & UI elements ─────────────────────────────────────────────────
  const form        = document.querySelector(".upload-form");
  const confirmBtn  = document.querySelector(".confirm-btn");
  const progressBox = document.getElementById("progress-box");
  const progressBar = document.getElementById("progress-fill");
  const progressPct = document.getElementById("progress-pct");
  const messageEl   = document.getElementById("upload-message");

  // Safety check for all required elements
  if (!realFile || !customBtn || !customText || !form || !confirmBtn || !messageEl) {
    console.error("Missing UI elements! Check these IDs in HTML:", {
      realFile: !!realFile,
      customBtn: !!customBtn,
      customText: !!customText,
      form: !!form,
      confirmBtn: !!confirmBtn,
      messageEl: !!messageEl
    });
    return;
  }

  console.log("All UI elements found ✓");

  // ── Custom "Choose File" button logic ──────────────────────────────────
  customBtn.addEventListener("click", () => {
    console.log("Choose File button clicked → triggering real input");
    realFile.click();
  });

  realFile.addEventListener("change", () => {
    const file = realFile.files[0];
    console.log("File selected:", file ? file.name : "none");
    customText.textContent = file ? file.name : "No file chosen, yet.";
  });

  // ── Form submission + Upload logic ─────────────────────────────────────
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      showMessage("You must be logged in to upload.", "error");
      window.location.href = "index.html";
      return;
    }

    console.log("User is logged in:", user.email || user.uid);

    const inputs     = form.querySelectorAll(".custom-input");
    const title      = inputs[0]?.value.trim();
    const authors    = inputs[1]?.value.trim();
    const department = inputs[2]?.value;
    const schoolYear = inputs[3]?.value;
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
      // Safe filename without relying on crypto.randomUUID()
      const fileExt  = file.name.split('.').pop().toLowerCase() || "pdf";
      const randomPart = Math.random().toString(36).substring(2, 10);
      const fileName = `${Date.now()}-${randomPart}.${fileExt}`;
      const filePath = `${UPLOAD_FOLDER}/${user.uid}/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
      if (!urlData?.publicUrl) {
        throw new Error("Could not generate public URL – check bucket settings");
      }
      const fileURL = urlData.publicUrl;

      // Save to database
      const { error: dbError } = await supabase
        .from("research")
        .insert({
          title,
          authors,
          department,
          school_year: schoolYear,
          file_url: fileURL,
          file_name: file.name,
          uploaded_by: user.displayName || user.email || "Unknown",
          user_id: user.uid,
          status: "pending",
          created_at: new Date().toISOString()
        });

      if (dbError) {
        await supabase.storage.from(BUCKET_NAME).remove([filePath]);
        throw dbError;
      }

      // Success
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
      console.error("Upload failed:", err);
      progressBox.style.display = "none";
      showMessage("Upload failed: " + (err.message || "Unknown error"), "error");
      confirmBtn.disabled = false;
      confirmBtn.textContent = "Confirm & Submit";
    }
  });

  // ── Helper functions ───────────────────────────────────────────────────
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

  console.log("Upload script fully initialized ✓");
});
