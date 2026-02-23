import { auth } from "./firebase.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


onAuthStateChanged(auth, (user) => {
    if (!user) {

        window.location.replace("../index.html");
    }
});



window.previewImage = (event) => {
    const reader = new FileReader();
    reader.onload = function() {
        const output = document.getElementById('imagePreview');
        const icon = document.getElementById('defaultIcon');



                
        output.style.backgroundImage = `url('${reader.result}')`;
        output.style.backgroundSize = 'cover';
        output.style.backgroundPosition = 'center';
        if (icon) icon.style.display = 'none';
    }
    reader.readAsDataURL(event.target.files[0]);
}

window.saveProfile = () => {
    const user = document.getElementById('username').value;
    const fname = document.getElementById('firstName').value;
    const lname = document.getElementById('lastName').value;
    document.getElementById('displayName').innerText = fname + " " + lname;
    
    alert("Profile successfully updated!\nNew Username: " + user);
}


window.confirmLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
        try {
            await signOut(auth);
            
            window.location.replace("index.html"); 
        } catch (error) {
            console.error("Logout Error:", error);
        }
    }
};
