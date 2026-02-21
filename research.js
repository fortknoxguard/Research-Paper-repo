let selectedYear = "ALL";
  let selectedDept = "ALL";

  window.onload = filterPapers;

  function toggleDrop(id) {
      const allDrops = document.querySelectorAll('.dropdown-content');
      allDrops.forEach(drop => {
          if (drop.id !== id) drop.classList.remove('show');
      });
      document.getElementById(id).classList.toggle("show");
  }

  window.onclick = function(event) {
      if (!event.target.closest('.dropdown')) {
          document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show'));
      }
  }

  function setFilter(type, value) {
      if (type === 'year') {
          selectedYear = value;
          document.getElementById('yearLabel').innerText = (value === 'ALL') ? "ALL YEARS" : value;
      } else if (type === 'dept') {
          selectedDept = value;
          const labels = { 'ALL': 'ALL DEPARTMENTS', 'AS': 'ARTS & SCIENCES', 'BA': 'BUSINESS & ACCOUNTANCY', 'CS': 'COMPUTER STUDIES', 'CA': 'CRIMINOLOGY & ADMINISTRATION', 'Engineering': 'ENGINEERING', 'TE': 'TEACHER EDUCATION', 'MET': 'MARITIME EDUCATION & TRAINING', 'ABM': 'ABM', 'STEM': 'STEM', 'HUMSS': 'HUMSS', 'GAS': 'GAS', 'ICT': 'ICT', 'HE': 'HE' };
          document.getElementById('deptLabel').innerText = labels[value] || value;
      }
      document.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('show'));
      filterPapers();
  }

  function filterPapers() {
      const searchInput = document.getElementById('searchInput').value.toLowerCase();
      const cards = document.querySelectorAll('.paper-card');
      let visibleCount = 0;

      cards.forEach(card => {
          const title = card.querySelector('.paper-title').innerText.toLowerCase();
          const meta = card.querySelector('.paper-meta').innerText.toLowerCase();
          const cardYear = card.getAttribute('data-year');
          const cardDept = card.getAttribute('data-dept');

          const matchesSearch = title.includes(searchInput) || meta.includes(searchInput);
          const matchesYear = (selectedYear === "ALL" || cardYear === selectedYear);
          const matchesDept = (selectedDept === "ALL" || cardDept === selectedDept);

          card.style.display = (matchesSearch && matchesYear && matchesDept) ? "block" : "none";
          if (card.style.display === "block") visibleCount++;
      });

      document.getElementById('resultsCount').innerText = `Total Research Papers: ${visibleCount}`;
      document.getElementById('noResults').style.display = (visibleCount === 0) ? "block" : "none";
  }

  function openResearch(id) {
      console.log("Opening Research: " + id);
  }
