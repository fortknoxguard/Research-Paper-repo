// supabase.js   ← replace everything in this file with this

// This is the global supabase object from the CDN script
// (loaded in HTML with <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>)

const SUPABASE_URL = 'https://tgciqknubmwinyykuuve.supabase.co';          // ← change to your real Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk'; // ← your anon public key

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    async getAccessToken() {
      // This pulls the Firebase ID token automatically when needed
      const user = firebase.auth().currentUser;
      if (user) {
        try {
          const token = await user.getIdToken(false);
          console.log('Firebase token attached for Supabase request');
          return token;
        } catch (err) {
          console.error('Failed to get Firebase token:', err);
          return null;
        }
      }
      console.log('No Firebase user → no token for Supabase');
      return null;
    }
  }
});

console.log('Supabase initialized (non-module CDN mode). Test: supabase.auth.getUser()');
