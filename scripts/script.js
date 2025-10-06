/* ==================== Liste de tes animes/mangas vus (MAL IDs) ==================== */
const myAnimeList = [
    41457, //86
    57892, // failure frame
    11061, // Hunter x Hunter (2011)
    37450, // bunny girl senpai
    34572, // black clover
    1575, // code geass
    5114,  // Fullmetal Alchemist: Brotherhood
    1535,  // Death Note
    16498, // Shingeki no Kyojin
    28851, // a silent voice
    50346, // call of the night
    47917, // bocchi the rock
    57181, // Blue Box (manga)
    35507, // classroom of the elite
    50425, // More Than a Married Couple, But Not Lovers
    30831, // Konosuba
    269, //bleach
    28999, // charlotte
    51705, // A Galaxy Next Door
    42310, // cyberpunk edgerunners
    4632, // bonne nuit pun pun
    53407, // bartender
    29803, // Overlord
    36882, // Arifureta
    49596, // blue lock
    24833, // assassination classroom
    34618, // blend S
    56964, // criminelles fiançailles
    52830, // cheat skill level up
    46352, // blue period
    44511, // chainsaw man
    2167, // clannad
    54112, //zom 100
    37105, // Grand Blue
    52308, // comment raeliana
    889, // black lagoon
    53300, // A Girl and Her Guard Dog
    53393, // Tengoku Daimakyo
    59845, // bloom
    144034, // Akane Banashi (manga)
    55866, // a sign of affection
    56923, // chillin life
    57719, // Akuyaku Reijou Tensei Ojisan
    2, // berserk

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

/* ==================== Fetch anime/manga avec fallback ==================== */
async function fetchById(id) {
  try {
    // D'abord l'anime
    let res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    let data = await res.json();
    if (data?.data) return { ...data.data, _type: "anime" };

    // Sinon le manga
    res = await fetch(`https://api.jikan.moe/v4/manga/${id}`);
    data = await res.json();
    if (data?.data) return { ...data.data, _type: "manga" };

    return null;
  } catch (e) {
    console.error("Erreur récupération ID:", id, e);
    return null;
  }
}

/* ==================== Récupération avec cache local + chargement progressif ==================== */
async function fetchMyAnimes(onAnimeLoaded) {
  const cacheKey = "myAnimeCache-v2";
  const cached = localStorage.getItem(cacheKey);
  let cacheData = [];

  // 1️⃣ Charger le cache existant s'il existe
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
  const missingIds = myAnimeList.filter(id => !cachedIds.has(id));

  if (missingIds.length === 0) return cacheData;

  // 3️⃣ Charger les manquants progressivement
  for (const id of missingIds) {
    const anime = await fetchById(id);
    if (anime) {
      cacheData.push(anime);
      onAnimeLoaded(anime);
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    }
    await new Promise(r => setTimeout(r, 400)); // limiter la vitesse pour éviter le ban
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

    // Filtrer par genre
    if (genreFilter) {
      const allLabels = [
        ...(anime.genres || []).map(g => g.name.toLowerCase()),
        ...(anime.themes || []).map(t => t.name.toLowerCase())
      ];
      if (!allLabels.includes(genreFilter.toLowerCase())) return;
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
