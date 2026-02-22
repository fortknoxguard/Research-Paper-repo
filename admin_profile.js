function previewImage(event) {
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

        function saveProfile() {
            const user = document.getElementById('username').value;
            const fname = document.getElementById('firstName').value;
            const lname = document.getElementById('lastName').value;
            document.getElementById('displayName').innerText = fname + " " + lname;
            
            alert("Profile successfully updated!\nNew Username: " + user);
        }
        function confirmLogout() {
            if(confirm('Log out of ICCTory?')) {
                window.location.href = "../login.html";
            }
        }
