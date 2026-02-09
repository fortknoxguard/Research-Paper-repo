// script.js

// ==================== Supabase Initialization ====================
const SUPABASE_URL = 'https://tgciqknubmwinyykuuve.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnY2lxa251Ym13aW55eWt1dXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNTA2NDMsImV4cCI6MjA4NTgyNjY0M30.eO5YV5ip9e4XNX7QtfZAnrMx_vCCv_HQSfdhD5HhKYk';

window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    async getAccessToken() {
      const user = firebase.auth().currentUser;
      if (user) {
        try {
          return await user.getIdToken(false);
        } catch (err) {
          console.warn('Failed to get Firebase ID token:', err);
          return null;
        }
      }
      return null;
    }
  }
});

console.log('Supabase client initialized in script.js');

// ==================== Login Form Handler ====================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('username').value.trim(); // ← change id to 'email' in HTML later for clarity
    const password = document.getElementById('password').value;

    if (!email.includes('@') || !email.includes('.')) {
      alert('Please enter a valid email address (e.g., name@example.com)');
      return;
    }

    console.log('Attempting login with:', email);

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log('Firebase login successful');
      // Auth state listener will handle showing the test section
    } catch (error) {
      console.error('Login error:', error.code, error.message);
      let msg = error.message;
      if (error.code === 'auth/invalid-email') {
        msg = 'Invalid email format – use the full email you signed up with.';
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        msg = 'Email or password incorrect.';
      }
      alert('Login failed: ' + msg);
    }
  });
}

// ==================== Test Insert Button Handler ====================
const testInsertBtn = document.getElementById('test-insert-btn');
if (testInsertBtn) {
  testInsertBtn.addEventListener('click', async () => {
    const resultEl = document.getElementById('test-result');
    resultEl.textContent = 'Inserting test row...';

    try {
      const firebaseUser = firebase.auth().currentUser;
      if (!firebaseUser) throw new Error('No Firebase user logged in – please log in first');

      console.log('Inserting with user UID:', firebaseUser.uid); // ← extra debug

      const { data, error } = await window.supabase
        .from('research_papers')
        .insert({
          "title": "Test Paper from ICCTory Login Page",
          "description": "Dummy insert after fixing quoted column names - " + new Date().toISOString(),
          "author": "Ritcher",
          "user_id": firebaseUser.uid,  // lowercase, no quotes needed
          "file_path": "test-folder/test-from-login.pdf",
          "file_name": "test-from-login.pdf",
          "file_size": 54321
          // If you add "mime_type" column later: "mime_type": "application/pdf"
        })
        .select();

      if (error) throw error;

      resultEl.textContent = 'SUCCESS! Inserted row:\n' + JSON.stringify(data, null, 2);
      console.log('Inserted successfully:', data);
    } catch (err) {
      resultEl.textContent = 'FAILED:\n' + err.message + '\n\nCheck console for details.';
      console.error('Insert error (full details):', err);
    }
  });
}

// ==================== Firebase Auth State Listener ====================
firebase.auth().onAuthStateChanged((user) => {
  const testSection = document.getElementById('test-section');
  if (user) {
    console.log('User signed in:', user.email, user.uid);
    if (testSection) testSection.style.display = 'block';
    // Optional: redirect when your upload page is ready
    // window.location.href = 'upload.html';
  } else {
    console.log('No user signed in');
    if (testSection) testSection.style.display = 'none';
  }
});
