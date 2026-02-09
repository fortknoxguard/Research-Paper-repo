// In your login.js or wherever the auth happens
const { data, error } = await supabase.auth.signInWithPassword({
  email: email,
  password: password,
});

if (error) {
  // Handle error
} else {
  // Temporarily redirect to test page instead of upload.html
  window.location.href = 'test-upload.html';
}
