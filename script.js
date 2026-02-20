const firebaseConfig = {
  apiKey: "AIzaSyDEOvNlFakVu0cvztoL-PhQI54kgc2q0C8",
  authDomain: "user-login-ad4e6.firebaseapp.com",
  projectId: "user-login-ad4e6",
  storageBucket: "user-login-ad4e6.firebasestorage.app",
  messagingSenderId: "815541711200",
  appId: "1:815541711200:web:c6a5a58a91df3321986e05",
  measurementId: "G-WEFZLHB7SC"
};

firebase.initializeApp(firebaseConfig);
console.log('Firebase initialized');

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
          const token = await user.getIdToken(false);
          console.log('Firebase ID token acquired for Supabase');
          return token;
        } catch (err) {
          console.warn('Failed to get Firebase ID token:', err);
          return null;
        }
      }
      console.log('No Firebase user → no token');
      return null;
    }
  }
});

console.log('Supabase client initialized');

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !email.includes('@') || !email.includes('.')) {
      alert('Please enter a valid email address');
      return;
    }

    console.log('Attempting login with:', email);

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log('Firebase login successful');
    } catch (error) {
      console.error('Login error:', error.code, error.message);
      let msg = error.message;
      if (error.code === 'auth/invalid-email') {
        msg = 'Invalid email format. Make sure you enter a full email.';
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        msg = 'Incorrect email or password.';
      }
      alert('Login failed: ' + msg);
    }
  });
}

firebase.auth().onAuthStateChanged((user) => {
  const testSection = document.getElementById('test-section');
  if (user) {
    console.log('User is signed in:', user.email, user.uid);
    if (testSection) testSection.style.display = 'block';
  } else {
    console.log('No user signed in');
    if (testSection) testSection.style.display = 'none';
  }
});
