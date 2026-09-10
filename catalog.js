// ---------------------------------------------------------
// LISTING DATA now lives in data.js (loaded before this file
// in index.html) as the global `listings` array.
// ---------------------------------------------------------

const categoryLabels = {
  sale: "For sale",
  rent: "For rent",
  land: "Land",
  materials: "Materials"
};

// ---------------------------------------------------------
// STATE
// ---------------------------------------------------------
let activeFilter = "all";
let searchTerm = "";

// ---------------------------------------------------------
// DOM REFS
// ---------------------------------------------------------
const catalogGrid = document.getElementById("catalogGrid");
const emptyState = document.getElementById("emptyState");
const resultsCount = document.getElementById("resultsCount");
const searchInput = document.getElementById("searchInput");
const tabs = document.querySelectorAll(".tab");

const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalRef = document.getElementById("modalRef");
const inquiryForm = document.getElementById("inquiryForm");
const modalSuccess = document.getElementById("modalSuccess");
const successName = document.getElementById("successName");

// ---------------------------------------------------------
// RENDER
// ---------------------------------------------------------
function render() {
  const filtered = listings.filter((item) => {
    const matchesCategory = activeFilter === "all" || item.category === activeFilter;
    const haystack = (item.title + " " + item.location).toLowerCase();
    const matchesSearch = haystack.includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  catalogGrid.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.hidden = false;
    resultsCount.textContent = "Showing 0 listings";
    return;
  }

  emptyState.hidden = true;
  resultsCount.textContent =
    `Showing ${filtered.length} listing${filtered.length === 1 ? "" : "s"}` +
    (activeFilter === "all" ? "" : ` — ${categoryLabels[activeFilter]}`);

  filtered.forEach((item) => {
    catalogGrid.appendChild(buildCard(item));
  });
}

function buildCard(item) {
  const card = document.createElement("article");
  card.className = "card";

  card.innerHTML = `
    <div class="card-image" style="background-image:url('${item.image}')">
      <span class="card-tag">${categoryLabels[item.category]}</span>
    </div>
    <div class="card-body">
      <h3 class="card-title">${item.title}</h3>
      <p class="card-location">${item.location}</p>
      <div class="card-specs">
        ${item.specs.map((s) => `<span>${s}</span>`).join("")}
      </div>
      <div class="card-footer">
        <p class="card-price">${item.price}<br><small>${item.priceNote}</small></p>
        <button class="inquire-btn" data-id="${item.id}">Inquire</button>
      </div>
    </div>
  `;

  card.querySelector(".inquire-btn").addEventListener("click", () => openModal(item));
  return card;
}

// ---------------------------------------------------------
// FILTER + SEARCH EVENTS
// ---------------------------------------------------------
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    activeFilter = tab.dataset.filter;
    render();
  });
});

searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value;
  render();
});

// ---------------------------------------------------------
// MODAL
// ---------------------------------------------------------
function openModal(item) {
  modalTitle.textContent = item.title;
  modalRef.textContent = `REF—${item.id}`;
  inquiryForm.hidden = false;
  modalSuccess.hidden = true;
  inquiryForm.reset();
  modalBackdrop.hidden = false;
}

function closeModal() {
  modalBackdrop.hidden = true;
}

modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modalBackdrop.hidden) closeModal();
});

inquiryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // NOTE: this only simulates a submission. To make inquiries real,
  // send this data to your backend (fetch/POST to an API endpoint,
  // or a form service) instead of just showing a success message.
  const name = document.getElementById("fullName").value;
  successName.textContent = name;
  inquiryForm.hidden = true;
  modalSuccess.hidden = false;
});

// ---------------------------------------------------------
// INIT
// ---------------------------------------------------------
render();