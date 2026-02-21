// js/reject.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

onAuthStateChanged(auth, (user) => {
  if (!user) { window.location.href = "../login.html"; return; }
  loadRejected();
});

function loadRejected() {
  const container = document.getElementById("rejectedList");
  const q = query(collection(db, "research"), where("status", "==", "rejected"));

  onSnapshot(q, (snapshot) => {
    container.innerHTML = "";

    if (snapshot.empty) {
      container.innerHTML = `<p class="empty-msg">No rejected papers.</p>`;
      return;
    }

    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      const date = d.createdAt?.toDate().toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric"
      }) || "—";

      const row = document.createElement("div");
      row.className = "request-row";
      row.innerHTML = `
        <span class="col-user">${d.uploadedBy || "—"}</span>
        <span class="col-title">
          <a href="${d.fileURL}" target="_blank" title="View file">${d.title}</a>
        </span>
        <span class="col-date">${date}</span>
        <span class="col-status">
          <span class="badge badge-rejected">Rejected</span>
        </span>
      `;
      container.appendChild(row);
    });
  });
}
