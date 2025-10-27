/* ==================== Configuration ==================== */
const PAGE_SIZE = 15;
let currentPage = 1;
let allAnimes = [];
let filteredAnimes = []; // animes filtrés par genre ou recherche

/* ==================== Chemin JSON ==================== */
// Chemin absolu pour GitHub Pages

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

/* ==================== Récupérer le genre de la page ==================== */
function getPageGenre() {
  return document.body.getAttribute("data-genre") || null;
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

/* ==================== Affichage d'une page ==================== */
function renderPage(page = 1, list = filteredAnimes) {
  const carousel = document.getElementById("carousel-inner-all");
  const paginationContainer = document.getElementById("pagination");
  carousel.innerHTML = "";

  const start = (page - 1) * PAGE_SIZE;
  const end = page * PAGE_SIZE;
  const pageItems = list.slice(start, end);

  if (pageItems.length === 0) {
    carousel.innerHTML = "<p style='color:red;'>Aucun anime trouvé pour ce genre.</p>";
    if (paginationContainer) paginationContainer.innerHTML = "";
    return;
  }

  pageItems.forEach(anime => {
    const item = document.createElement("div");
    item.className = "anime-item";
    item.onclick = () => showAnimeDetails(anime);
    const status = localStorage.getItem(anime.title) || "Non défini";
    item.innerHTML = `
      <img src="${anime.image}" alt="${escapeHtml(anime.title)}">
      <p>${escapeHtml(anime.title)}</p>
    `;
    carousel.appendChild(item);
  });

  renderPaginationControls(page, list);
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

  filteredAnimes = filterByGenre(searchFiltered);
  currentPage = 1;
  renderPage(currentPage, filteredAnimes);
}

function clearSearch() {
  document.getElementById("search-bar").value = "";
  filteredAnimes = filterByGenre(allAnimes);
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

/* ==================== Modal pour changer le statut ==================== */
function setupStatusModal() {
  const changeStatusBtn = document.getElementById("change-status-btn");
  const statusModal = document.getElementById("status-modal");
  const closeModal = document.getElementById("close-modal");
  const animeSelect = document.getElementById("anime-select");
  const statusSelect = document.getElementById("status-select");
  const saveStatusBtn = document.getElementById("save-status");

  changeStatusBtn.onclick = () => {
    animeSelect.innerHTML = "";
    allAnimes.forEach(a => {
      const option = document.createElement("option");
      const savedStatus = localStorage.getItem(a.title);
      option.value = a.title;
      option.innerText = a.title + (savedStatus ? ` (${savedStatus})` : "");
      animeSelect.appendChild(option);
    });
    statusModal.classList.remove("hidden");
  };

  closeModal.onclick = () => statusModal.classList.add("hidden");

  saveStatusBtn.onclick = () => {
    const animeTitle = animeSelect.value;
    const status = statusSelect.value;
    localStorage.setItem(animeTitle, status);
    const animeObj = allAnimes.find(a => a.title === animeTitle);
    if(animeObj) animeObj.status = status;
    alert(`Statut de "${animeTitle}" mis à jour : ${status}`);
    statusModal.classList.add("hidden");
    renderPage(currentPage, filteredAnimes); // rafraîchit la page pour afficher le statut
  };
}

/* ==================== Initialisation ==================== */
document.addEventListener("DOMContentLoaded", async () => {
  await loadAllAnimes();
  filteredAnimes = filterByGenre(allAnimes);
  renderPage(1, filteredAnimes);
  setupStatusModal(); // initialise la modal
});
