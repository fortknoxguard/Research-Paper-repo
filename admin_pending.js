// js/admin_pending.js
import { db } from "./firebase.js";
import { requireRole } from "./auth_redirect.js";
import { collection, query, where, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

requireRole("admin", () => {
  loadPending();
});

function loadPending() {
  const container = document.getElementById("requestList");

  // ✅ No uploadedBy filter — admin sees ALL pending papers from ALL students
  const q = query(collection(db, "research"), where("status", "==", "pending"));

  onSnapshot(q, (snapshot) => {
    container.innerHTML = "";

    if (snapshot.empty) {
      container.innerHTML = `<p class="empty-msg">No pending papers at the moment.</p>`;
      return;
    }

    snapshot.forEach((docSnap) => {
      const d  = docSnap.data();
      const id = docSnap.id;
      const date = d.createdAt?.toDate().toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric"
      }) || "—";

      const row = document.createElement("div");
      row.className = "request-row";
      row.innerHTML = `
        <span class="col-user">${d.uploadedBy || "—"}</span>
        <span class="col-title">
          <a href="${d.fileURL}" target="_blank">${d.title}</a>
        </span>
        <span class="col-date">${date}</span>
        <span class="col-status">
          <span class="badge badge-pending">Pending</span>
        </span>
        <span class="col-actions">
          <button class="action-btn accept-btn" data-id="${id}">
            <i class="fa-solid fa-check"></i> Accept
          </button>
          <button class="action-btn reject-btn" data-id="${id}">
            <i class="fa-solid fa-xmark"></i> Reject
          </button>
        </span>
      `;
      container.appendChild(row);
    });

    // ✅ Accept button
    container.querySelectorAll(".accept-btn").forEach((btn) =>
      btn.addEventListener("click", () => updateStatus(btn.dataset.id, "published"))
    );
    // ✅ Reject button
    container.querySelectorAll(".reject-btn").forEach((btn) =>
      btn.addEventListener("click", () => updateStatus(btn.dataset.id, "rejected"))
    );
  });
}

async function updateStatus(id, status) {
  try {
    await updateDoc(doc(db, "research", id), { status });
    console.log(`Paper ${id} updated to: ${status}`);
  } catch (err) {
    console.error("Failed to update:", err);
    alert("Could not update status. Please try again.");
  }
}
