import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk"; 
const BUCKET_NAME = "research papers"; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
    const realFile = document.getElementById("real-file");
    const customBtn = document.getElementById("custom-button");
    const customText = document.getElementById("custom-text");
    const form = document.querySelector(".upload-form");
    const confirmBtn = document.querySelector(".confirm-btn");

    customBtn.addEventListener("click", () => realFile.click());
    realFile.addEventListener("change", () => {
        customText.textContent = realFile.files[0] ? realFile.files[0].name : "No file chosen";
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const user = auth.currentUser;

        if (!user) {
            alert("Please log in first.");
            return;
        }

        const title = form.querySelector('[name="title"]').value.trim();
        const authors = form.querySelector('[name="authors"]').value.trim();
        const file = realFile.files[0];

        if (!file) {
            alert("Please select a file.");
            return;
        }

        confirmBtn.disabled = true;
        confirmBtn.textContent = "Uploading...";

        try {
            // 1. Pathing (Organized by UID folder)
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = `${user.uid}/${fileName}`;

            // 2. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 3. Insert to Table (FIXED NAMES)
            const { error: dbError } = await supabase.from("research_papers").insert({
                "Title": title,
                "Author": authors,
                "user_id": user.uid,
                "file_path": filePath,
                "file_name": file.name,
                "status": "pending"
            });

            if (dbError) throw dbError;

            alert("Upload Successful! Awaiting admin approval.");
            form.reset();
            customText.textContent = "No file chosen";
        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        } finally {
            confirmBtn.disabled = false;
            confirmBtn.textContent = "Confirm & Submit";
        }
    });
});
