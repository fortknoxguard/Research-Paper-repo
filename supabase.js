// supabase.js
// This file initializes the Supabase client and makes it use your Firebase user's ID token automatically.
// Load this file in your HTML with: <script type="module" src="supabase.js"></script>

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://tgciqknubmwinyykuuve.supabase.co';      
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk';      // ← CHANGE THIS (anon public key from same page)

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,     // We don't use Supabase's own tokens
    persistSession: false,       // We don't store Supabase sessions
    // This is the key part: Supabase will call this function every time it needs an access token
    // → it gets the CURRENT Firebase ID token and sends it to Supabase servers
    async getAccessToken() {
      // firebase is the global Firebase object from your firebase.js / firebase SDK scripts
      const user = firebase.auth().currentUser;

      if (user) {
        // ← FIREBASE ID TOKEN comes from here!
        // This is the "firebase token" you asked about.
        // It is automatically created when the user signs in with Firebase (email/password, Google, etc.).
        // You DO NOT need to copy-paste or hardcode it anywhere — the code fetches it fresh each time.
        // It looks like a long string starting with "eyJ..." (a JWT).
        try {
          const token = await user.getIdToken(/* forceRefresh: */ false);
          return token;  // ← This is where the Firebase token is provided to Supabase
        } catch (err) {
          console.error('Error getting Firebase ID token:', err);
          return null;
        }
      }

      // No logged-in Firebase user → no token
      return null;
    }
  }
});

// Make supabase available globally so your other scripts (like upload.js) can use it
window.supabase = supabase;

console.log('Supabase client initialized with Firebase token support');
