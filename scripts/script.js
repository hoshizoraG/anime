/* ==================== Liste de tes animes/mangas vus (MAL IDs) ==================== */
const myAnimeList = [
  { id: 41457, type: "anime" }, // 86
  { id: 57892, type: "anime" }, // failure frame
  { id: 11061, type: "anime" }, // Hunter x Hunter (2011)
  { id: 37450, type: "anime" }, // bunny girl senpai
  { id: 34572, type: "anime" }, // black clover
  { id: 1575, type: "anime" }, // code geass
  { id: 5114, type: "anime" },  // Fullmetal Alchemist: Brotherhood
  { id: 1535, type: "anime" },  // Death Note
  { id: 16498, type: "anime" }, // Shingeki no Kyojin
  { id: 28851, type: "anime" }, // a silent voice
  { id: 50346, type: "anime" }, // call of the night
  { id: 47917, type: "anime" }, // bocchi the rock
  { id: 57181, type: "anime" }, // Blue Box (manga)
  { id: 35507, type: "anime" }, // classroom of the elite
  { id: 50425, type: "anime" }, // More Than a Married Couple, But Not Lovers
  { id: 30831, type: "anime" }, // Konosuba
  { id: 35849, type: "anime" }, // darling in the franxx
  { id: 269, type: "anime" },   // bleach
  { id: 28999, type: "anime" }, // charlotte
  { id: 51705, type: "anime" }, // A Galaxy Next Door
  { id: 42310, type: "anime" }, // cyberpunk edgerunners
  { id: 4632, type: "anime" },  // bonne nuit pun pun
  { id: 53407, type: "anime" }, // bartender
  { id: 28223, type: "anime" }, // death parad
  { id: 29803, type: "anime" }, // Overlord
  { id: 36882, type: "anime" }, // Arifureta
  { id: 49596, type: "anime" }, // blue lock
  { id: 57334, type: "anime" }, // dandadan
  { id: 24833, type: "anime" }, // assassination classroom
  { id: 34618, type: "anime" }, // blend S
  { id: 56964, type: "anime" }, // criminelles fiançailles
  { id: 52830, type: "anime" }, // cheat skill level up
  { id: 46352, type: "anime" }, // blue period
  { id: 44511, type: "anime" }, // chainsaw man
  { id: 2167, type: "anime" },  // clannad
  { id: 52505, type: "anime" }, // dark gathering
  { id: 54112, type: "anime" }, // zom 100
  { id: 37105, type: "anime" }, // Grand Blue
  { id: 52308, type: "anime" }, // comment raeliana
  { id: 50392, type: "anime" }, // demon slave
  { id: 889, type: "anime" },   // black lagoon
  { id: 53300, type: "anime" }, // A Girl and Her Guard Dog
  { id: 53393, type: "anime" }, // Tengoku Daimakyo
  { id: 59845, type: "anime" }, // bloom
  { id: 144034, type: "manga" }, // Akane Banashi (manga)
  { id: 55866, type: "anime" }, // a sign of affection
  { id: 56923, type: "anime" }, // chillin life
  { id: 57719, type: "anime" }, // Akuyaku Reijou Tensei Ojisan
  { id: 2, type: "manga" },     // berserk
];

/* ==================== Normalisation du titre ==================== */
function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/season \d+/g, "")
    .replace(/part \d+/g, "")
    .trim();
}

/* ==================== Fetch anime/manga (sans fallback inutile) ==================== */
async function fetchById({ id, type }) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/${type}/${id}`);
    const data = await res.json();
    if (data?.data) return { ...data.data, _type: type };
    return null;
  } catch (e) {
    console.error("Erreur récupération ID:", id, e);
    return null;
  }
}

/* ==================== Récupération avec cache local + chargement progressif ==================== */
async function fetchMyAnimes(onAnimeLoaded) {
  const cacheKey = "myAnimeCache-v3";
  const cached = localStorage.getItem(cacheKey);
  let cacheData = [];

  // 1️⃣ Charger le cache existant
  if (cached) {
    try {
      cacheData = JSON.parse(cached);
      cacheData.forEach(a => onAnimeLoaded(a)); // affichage immédiat
    } catch {
      cacheData = [];
    }
  }

  // 2️⃣ Identifier les IDs manquants
  const cachedIds = new Set(cacheData.map(a => a.mal_id));
  const missing = myAnimeList.filter(entry => !cachedIds.has(entry.id));

  if (missing.length === 0) return cacheData;

  // 3️⃣ Charger progressivement
  for (const entry of missing) {
    const anime = await fetchById(entry);
    if (anime) {
      cacheData.push(anime);
      onAnimeLoaded(anime);
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    }
    await new Promise(r => setTimeout(r, 400)); // éviter le rate limit
  }

  return cacheData;
}

/* ==================== Génération de la galerie ==================== */
async function generateAnimeGallery(genreFilter = null) {
  const carousel = document.getElementById("carousel-inner-all");
  carousel.innerHTML = "<p>Chargement des animes...</p>";

  const grouped = {};

  function addAnimeToGallery(anime) {
    const key = normalizeTitle(anime.title || anime.title_english || anime.title_japanese || "");
    if (grouped[key]) return; // éviter les doublons de saisons
    grouped[key] = anime;

    // Filtrage par genre
    if (genreFilter) {
      const labels = [
        ...(anime.genres || []).map(g => g.name.toLowerCase()),
        ...(anime.themes || []).map(t => t.name.toLowerCase())
      ];
      if (!labels.includes(genreFilter.toLowerCase())) return;
    }

    const item = document.createElement("div");
    item.className = "anime-item";
    item.onclick = () => showAnimeDetails(anime);

    const imgSrc = anime.images?.jpg?.image_url || anime.images?.webp?.image_url || "";

    item.innerHTML = `
      <img src="${imgSrc}" alt="${escapeHtml(anime.title || "")}">
      <p>${escapeHtml(anime.title || "")}</p>
      <p style="font-size:0;">${escapeHtml(anime.title_english || anime.title_japanese || "")}</p>
    `;
    carousel.appendChild(item);
  }

  carousel.innerHTML = "";
  await fetchMyAnimes(addAnimeToGallery);
}

/* ==================== Détails ==================== */
function showAnimeDetails(anime) {
  document.getElementById("search-container")?.style.setProperty("display", "none");
  document.getElementById("header")?.style.setProperty("display", "none");
  document.querySelector("#carousel")?.style.setProperty("display", "none");

  const imgEl = document.getElementById("anime-img");
  if (imgEl) imgEl.src = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "";

  document.getElementById("anime-title").innerText = anime.title || "";
  document.getElementById("anime-synopsis").innerText = anime.synopsis || "Pas de synopsis disponible";

  document.getElementById("anime-info").innerHTML = `
    <p>Type: ${escapeHtml(anime.type || "Inconnu")}</p>
  `;

  document.getElementById("anime-movie-label").innerHTML =
    anime.type === "Movie" ? "<strong>C'est un Film</strong>" : "";

  fetchCharacters(anime.mal_id, anime._type);

  const details = document.getElementById("anime-details");
  details.classList.add("show");
  details.scrollIntoView({ behavior: "smooth" });
}

/* ==================== Fermeture ==================== */
function closeDetails() {
  document.getElementById("anime-details")?.classList.remove("show");
  document.querySelector("#carousel")?.style.setProperty("display", "flex");
  document.getElementById("header")?.style.setProperty("display", "flex");
  document.getElementById("search-container")?.style.setProperty("display", "block");
}

/* ==================== Recherche ==================== */
function searchAnime() {
  const query = (document.getElementById("search-bar")?.value || "")
    .toLowerCase()
    .replace(/\s+/g, "");
  const carousel = document.getElementById("carousel-inner-all");
  if (!carousel) return;
  const items = carousel.querySelectorAll(".anime-item");

  let hasVisible = false;
  items.forEach(item => {
    const title = (item.querySelector("p")?.innerText || "").toLowerCase().replace(/\s+/g, "");
    const alias = (item.querySelectorAll("p")[1]?.innerText || "").toLowerCase().replace(/\s+/g, "");
    const visible = title.includes(query) || alias.includes(query);
    item.style.display = visible ? "block" : "none";
    if (visible) hasVisible = true;
  });

  let msg = carousel.querySelector(".no-results-message");
  if (!msg) {
    msg = document.createElement("p");
    msg.className = "no-results-message";
    msg.style.color = "red";
    carousel.appendChild(msg);
  }
  msg.style.display = hasVisible ? "none" : "block";
  msg.textContent = hasVisible ? "" : "Aucun résultat trouvé";
}

function clearSearch() {
  const sb = document.getElementById("search-bar");
  if (sb) sb.value = "";
  searchAnime();
}

/* ==================== Persos ==================== */
async function fetchCharacters(id, type) {
  try {
    if (!id || !type) return;
    const res = await fetch(`https://api.jikan.moe/v4/${type}/${id}/characters`);
    const data = await res.json();
    const chars = data.data || [];
    const list = document.getElementById("anime-characters");
    if (!list) return;
    list.innerHTML = "";

    if (chars.length > 0) {
      chars.slice(0, 4).forEach(c => {
        const img = document.createElement("img");
        img.src = c.character?.images?.jpg?.image_url || c.character?.images?.webp?.image_url || "";
        img.alt = c.character?.name || "";
        img.title = c.character?.name || "";
        list.appendChild(img);
      });
    } else {
      list.innerHTML = "<p>Aucun personnage trouvé</p>";
    }
  } catch (err) {
    console.error("Erreur persos:", err);
  }
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

/* ==================== Init ==================== */
document.addEventListener("DOMContentLoaded", () => {
  const genre = document.body.dataset.genre || null;
  generateAnimeGallery(genre);
});
