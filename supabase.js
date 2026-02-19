async function uploadResearch(file) {
  
  const userId = firebase.auth().currentUser?.uid || 'anonymous';
  const fileName = `${userId}/${Date.now()}-${file.name}`;

  const { data, error } = await window.supabase.storage
    .from('research paper') 
    .upload(fileName, file);

  if (error) {
    console.error("Upload Error:", error.message);
    alert("Upload failed: " + error.message);
  } else {
    console.log("Upload Success:", data);
    alert("Research PDF uploaded successfully!");
  }
}
