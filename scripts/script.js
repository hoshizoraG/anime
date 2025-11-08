/* ==================== Configuration ==================== */
const PAGE_SIZE = 15;
let currentPage = 1;
let allAnimes = [];
let filteredAnimes = [];
let currentAnimeForStatus = null; // Anime actuellement sélectionné pour changer le statut

/* ==================== Chargement du JSON ==================== */
async function loadAllAnimes() {
  try {
    const res = await fetch("https://hoshizorag.github.io/anime/data/animes.json")
    if (!res.ok) throw new Error(`Impossible de charger le JSON : ${res.status} ${res.statusText}`);
    const text = await res.text();
    try {
      allAnimes = JSON.parse(text);
      // Charger les statuts depuis localStorage
      allAnimes.forEach(a => {
        const savedStatus = localStorage.getItem(a.title);
        if(savedStatus) a.status = savedStatus;
      });
    } catch (e) {
      throw new Error("JSON invalide : " + e.message);
    }
  } catch (e) {
    console.error("Erreur chargement du JSON:", e);
    const carousel = document.getElementById("carousel-inner-all");
    if (carousel) carousel.innerHTML = "<p style='color:red;'>Impossible de charger la liste des animes.</p>";
  }
}

/* ==================== Récupérer le genre/statut de la page ==================== */
function getPageGenre() {
  return document.body.getAttribute("data-genre") || null;
}

function getPageStatus() {
  return document.body.getAttribute("data-status") || null;
}

/* ==================== Filtrage par genre/thème ==================== */
function filterByGenre(list) {
  const genre = getPageGenre();
  if (!genre) return list;
  return list.filter(a => {
    const genres = (a.genres || []).map(g => g.toLowerCase());
    const themes = (a.themes || []).map(t => t.toLowerCase());
    return genres.includes(genre.toLowerCase()) || themes.includes(genre.toLowerCase());
  });
}

/* ==================== Filtrage par statut ==================== */
function filterByStatus(list) {
  const status = getPageStatus();
  if (!status) return list;
  return list.filter(a => {
    const savedStatus = localStorage.getItem(a.title) || "Non défini";
    return savedStatus === status;
  });
}

/* ==================== Affichage d'une page ==================== */
function renderPage(page = 1, list = filteredAnimes) {
  const carousel = document.getElementById("carousel-inner-all");
  const paginationContainer = document.getElementById("pagination");
  carousel.innerHTML = "";

  const start = (page - 1) * PAGE_SIZE;
  const end = page * PAGE_SIZE;
  const pageItems = list.slice(start, end);

  if (pageItems.length === 0) {
    carousel.innerHTML = "<p style='color:red;'>Aucun anime trouvé.</p>";
    if (paginationContainer) paginationContainer.innerHTML = "";
    return;
  }

  pageItems.forEach(anime => {
    const item = document.createElement("div");
    item.className = "anime-item";
    
    const status = localStorage.getItem(anime.title) || "Non défini";
    
    item.innerHTML = `
  <img src="${anime.image}" alt="${escapeHtml(anime.title)}">
  <p class="anime-title">${escapeHtml(anime.title)}</p>
  <div class="status-badge ${status.toLowerCase().replace(/\s+/g, '-')}">${escapeHtml(status)}</div>
  <button class="change-status-btn">📝 Modifier</button>
`;
// Ajout du gestionnaire d'événement pour le bouton "Modifier"
const button = item.querySelector(".change-status-btn");
button.addEventListener("click", (e) => {
  e.stopPropagation(); // empêche le clic d’ouvrir les détails
  openStatusModal(anime.title);
});

    
    // Clic sur l'item pour voir les détails
    item.onclick = (e) => {
      if (!e.target.classList.contains('change-status-btn')) {
        showAnimeDetails(anime);
      }
    };
    
    carousel.appendChild(item);
  });

  renderPaginationControls(page, list);
}

/* ==================== Modal de changement de statut ==================== */
function openStatusModal(title) {
  currentAnimeForStatus = title;
  const modal = document.getElementById("status-modal");
  const modalTitle = document.getElementById("modal-anime-title");
  const currentStatus = localStorage.getItem(title) || "Non défini";
  
  modalTitle.textContent = title;
  
  // Pré-sélectionner le statut actuel
  const statusSelect = document.getElementById("status-select");
  statusSelect.value = currentStatus;
  
  modal.classList.remove("hidden");
}

function closeStatusModal() {
  const modal = document.getElementById("status-modal");
  modal.classList.add("hidden");
  currentAnimeForStatus = null;
}

function saveAnimeStatus() {
  if (!currentAnimeForStatus) return;
  
  const statusSelect = document.getElementById("status-select");
  const newStatus = statusSelect.value;
  
  localStorage.setItem(currentAnimeForStatus, newStatus);
  const animeObj = allAnimes.find(a => a.title === currentAnimeForStatus);
  if(animeObj) animeObj.status = newStatus;
  
  // Réappliquer les filtres
  let filtered = allAnimes;
  filtered = filterByGenre(filtered);
  filtered = filterByStatus(filtered);
  
  // Recherche active ?
  const searchBar = document.getElementById("search-bar");
  if (searchBar && searchBar.value.trim() !== "") {
    const query = searchBar.value.toLowerCase().replace(/\s+/g, "");
    filtered = filtered.filter(a => {
      const titleMatch = (a.title || "").toLowerCase().replace(/\s+/g, "");
      const alias = (a.title_english || a.title_japanese || "").toLowerCase().replace(/\s+/g, "");
      return titleMatch.includes(query) || alias.includes(query);
    });
  }
  
  filteredAnimes = filtered;
  renderPage(currentPage, filteredAnimes);
  closeStatusModal();
}

/* ==================== Pagination ==================== */
function renderPaginationControls(page, list = filteredAnimes) {
  const container = document.getElementById("pagination");
  if (!container) return;

  container.innerHTML = "";
  const totalPages = Math.ceil(list.length / PAGE_SIZE);

  const prev = document.createElement("button");
  prev.textContent = "← Précédent";
  prev.disabled = page <= 1;
  prev.onclick = () => changePage(page - 1, list);

  const next = document.createElement("button");
  next.textContent = "Suivant →";
  next.disabled = page >= totalPages;
  next.onclick = () => changePage(page + 1, list);

  const label = document.createElement("span");
  label.textContent = `Page ${page} / ${totalPages}`;

  container.appendChild(prev);
  container.appendChild(label);
  container.appendChild(next);
}

/* ==================== Changer de page ==================== */
function changePage(newPage, list = filteredAnimes) {
  currentPage = newPage;
  renderPage(currentPage, list);
}

/* ==================== Recherche globale ==================== */
function searchAnime() {
  const query = (document.getElementById("search-bar")?.value || "")
    .toLowerCase().replace(/\s+/g, "");

  let searchFiltered = allAnimes.filter(a => {
    const title = (a.title || "").toLowerCase().replace(/\s+/g, "");
    const alias = (a.title_english || a.title_japanese || "").toLowerCase().replace(/\s+/g, "");
    return title.includes(query) || alias.includes(query);
  });

  searchFiltered = filterByGenre(searchFiltered);
  searchFiltered = filterByStatus(searchFiltered);
  
  filteredAnimes = searchFiltered;
  currentPage = 1;
  renderPage(currentPage, filteredAnimes);
}

function clearSearch() {
  document.getElementById("search-bar").value = "";
  filteredAnimes = filterByGenre(allAnimes);
  filteredAnimes = filterByStatus(filteredAnimes);
  currentPage = 1;
  renderPage(currentPage, filteredAnimes);
}

/* ==================== Détails ==================== */
function showAnimeDetails(anime) {
  document.getElementById("search-container").style.display = "none";
  document.getElementById("header").style.display = "none";
  document.querySelector("#carousel").style.display = "none";
  document.getElementById("pagination").style.display = "none"; 

  document.getElementById("anime-img").src = anime.image;
  document.getElementById("anime-title").innerText = anime.title;
  document.getElementById("anime-synopsis").innerText =
    anime.synopsis || "Pas de synopsis disponible";

  const savedStatus = localStorage.getItem(anime.title) || "Non défini";

  document.getElementById("anime-info").innerHTML = `
    <p>Type: ${escapeHtml(anime.type || "Inconnu")}</p>
    <p>Genres: ${escapeHtml((anime.genres || []).join(", "))}</p>
    <p>Thèmes: ${escapeHtml((anime.themes || []).join(", "))}</p>
    <p>Status personnel: ${escapeHtml(savedStatus)}</p>
  `;

  document.getElementById("anime-details").classList.add("show");
}

function closeDetails() {
  document.getElementById("anime-details").classList.remove("show");
  document.querySelector("#carousel").style.display = "flex";
  document.getElementById("header").style.display = "flex";
  document.getElementById("search-container").style.display = "block";
  document.getElementById("pagination").style.display = "flex"; 
}

/* ==================== Utils ==================== */
function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, s => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[s]);
}

/* ==================== Initialisation ==================== */
document.addEventListener("DOMContentLoaded", async () => {
  await loadAllAnimes();
  filteredAnimes = filterByGenre(allAnimes);
  filteredAnimes = filterByStatus(filteredAnimes);
  renderPage(1, filteredAnimes);
  
  // Fermer la modal si on clique en dehors
  const modal = document.getElementById("status-modal");
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeStatusModal();
    }
  });

});
