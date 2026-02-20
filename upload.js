import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { auth } from "./firebase.js";

const SUPABASE_URL = "https://tgciqknubmwinyykuuve.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // Use your full key
const BUCKET_NAME = "research papers"; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", () => {
    const realFile = document.getElementById("real-file");
    const customBtn = document.getElementById("custom-button");
    const customText = document.getElementById("custom-text");
    const form = document.querySelector(".upload-form");
    const confirmBtn = document.querySelector(".confirm-btn");
    const messageEl = document.getElementById("upload-message");

    // File Picker Trigger
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

        // Get values by Name attribute
        const title = form.querySelector('[name="title"]').value.trim();
        const authors = form.querySelector('[name="authors"]').value.trim();
        const department = form.querySelector('[name="department"]').value;
        const schoolYear = form.querySelector('[name="school_year"]').value;
        const file = realFile.files[0];

        confirmBtn.disabled = true;
        confirmBtn.textContent = "Uploading...";

        try {
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = `pending/${user.uid}/${fileName}`;

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
            
            // 3. Insert to Database
            const { error: dbError } = await supabase.from("research").insert({
                title,
                authors,
                department,
                school_year: schoolYear,
                file_url: urlData.publicUrl,
                user_id: user.uid,
                status: "pending"
            });

            if (dbError) throw dbError;

            alert("Upload Successful!");
            form.reset();
        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        } finally {
            confirmBtn.disabled = false;
            confirmBtn.textContent = "Confirm & Submit";
        }
    });
});
