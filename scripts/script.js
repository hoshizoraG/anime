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
  { id: 30, type: "anime" },     // evangelion
  { id: 16498, type: "anime" }, // Shingeki no Kyojin
  { id: 28851, type: "anime" }, // a silent voice
  { id: 50346, type: "anime" }, // call of the night
  { id: 47917, type: "anime" }, // bocchi the rock
  { id: 57181, type: "anime" }, // Blue Box (manga)
  { id: 35507, type: "anime" }, // classroom of the elite
  { id: 50425, type: "anime" }, // More Than a Married Couple, But Not Lovers
  { id: 30831, type: "anime" }, // Konosuba
  { id: 51417, type: "anime" }, // engage kiss
  { id: 35849, type: "anime" }, // darling in the franxx
  { id: 269, type: "anime" },   // bleach
  { id: 28999, type: "anime" }, // charlotte
  { id: 51705, type: "anime" }, // A Galaxy Next Door
  { id: 42310, type: "anime" }, // cyberpunk edgerunners
  { id: 4632, type: "anime" },  // bonne nuit pun pun
  { id: 53407, type: "anime" }, // bartender
  { id: 28223, type: "anime" }, // death parad
  { id: 31043, type: "anime" }, // erased
  { id: 29803, type: "anime" }, // Overlord
  { id: 59062, type: "anime" }, // gahiakuta
  { id: 22297, type: "anime" }, // fate
  { id: 36882, type: "anime" }, // Arifureta
  { id: 49596, type: "anime" }, // blue lock
  { id: 38671, type: "anime" }, // fire force
  { id: 57334, type: "anime" }, // dandadan
  { id: 24833, type: "anime" }, // assassination classroom
  { id: 34618, type: "anime" }, // blend S
  { id: 52991, type: "anime" }, // frieren
  { id: 56964, type: "anime" }, // criminelles fiançailles
  { id: 52830, type: "anime" }, // cheat skill level up
  { id: 46352, type: "anime" }, // blue period
  { id: 44511, type: "anime" }, // chainsaw man
  { id: 2167, type: "anime" },  // clannad
  { id: 52505, type: "anime" }, // dark gathering
  { id: 54112, type: "anime" }, // zom 100
  { id: 37982, type: "anime" }, // domestic na kanojo
  { id: 37105, type: "anime" }, // Grand Blue
  { id: 52308, type: "anime" }, // comment raeliana
  { id: 50392, type: "anime" }, // demon slave
  { id: 889, type: "anime" },   // black lagoon
  { id: 53300, type: "anime" }, // A Girl and Her Guard Dog
  { id: 53393, type: "anime" }, // Tengoku Daimakyo
  { id: 59845, type: "anime" }, // bloom
  { id: 52215, type: "anime" }, // orb
  { id: 144034, type: "manga" }, // Akane Banashi (manga)
  { id: 55866, type: "anime" }, // a sign of affection
  { id: 56923, type: "anime" }, // chillin life
  { id: 57719, type: "anime" }, // Akuyaku Reijou Tensei Ojisan
  { id: 2, type: "manga" },     // berserk
  { id: 38000, type: "anime" }, // demon slayer
  { id: 43969, type: "anime" }, // girlfriend girlfriend
  {id: 14131, type: "anime" }, // Girls & Panzer
  { id: 17895, type: "anime" }, // Golden Time
  { id: 245, type: "anime" }, // Great Teacher Onizuka
  { id: 2001, type: "anime" }, // Tengen Toppa Gurren Lagann
  { id: 20583, type: "anime" }, // Haikyuu!!
  { id: 46569, type: "anime" }, // Jigokuraku
  { id: 40938, type: "anime" }, // Hige wo Soru. Soshite Joshikousei wo Hirou.
  { id: 146966, type: "manga" }, // highschool mercenary
  { id: 52405, type: "anime" }, // Highspeed Etoile
  { id: 53421, type: "anime" }, // Dosanko Gal wa Namara Menkoi
  { id: 58271, type: "anime" }, // Honey Lemon Soda
  { id: 163630, type: "manga" }, // hope you're happy lemon
  { id: 42897, type: "anime" }, // Horimiya
  { id: 59361, type: "anime" }, // Kono Kaisha ni Suki na Hito ga Imasu
  { id: 56228, type: "anime" }, // Rekishi ni Nokoru Akujo ni Naru zo
  { id: 5231, type: "anime" }, // Inazuma Eleven
  { id: 185, type: "anime" }, // Initial D 
  { id: 48926, type: "anime" }, // Komi can't communicate
  { id: 39017, type: "anime" }, // Kyokou Suiri
  { id: 36098, type: "anime" }, // Kimi no Suizou wo Tabetai
  { id: 56230, type: "anime" }, // Jiisan Baasan Wakagaeru
  { id: 14719, type: "anime" }, // JoJo 
  { id: 12679, type: "anime" }, // Joshiraku
  { id: 40748, type: "anime" }, // Jujutsu Kaisen
  { id: 168312, type: "manga" }, // just friends
  { id: 37999, type: "anime" }, // Kaguya-sama wa Kokurasetai: Tensai-tachi no Renai Zunousen
  { id: 52588, type: "anime" }, // kaiju
  { id: 34933, type: "anime" }, // Kakegurui
  { id: 59452, type: "anime" }, // katainaka no ossan
  { id: 18679, type: "anime" }, // Kill la Kill
  { id: 6045, type: "anime" }, // kimi no todoke
  { id: 57611, type: "anime"}, //kimi wa maid sama
  { id: 23273, type: "anime" }, // Shigatsu wa Kimi no Uso
  { id: 62613, type: "anime" }, // Youchien Wars
  { id: 60083, type: "anime" }, // Kowloon Generic Romance
  { id: 11771, type: "anime" }, // Kuroko no Basket
  { id: 17729, type: "anime" }, // Grisaia no Kajitsu
  { id: 51288, type: "anime" }, // Zuoshou Shanglan
  { id: 54492, type: "anime" }, // Kusuriya no Hitorigoto
  { id: 48633, type: "anime" }, // Liar Liar
  { id: 44074, type: "anime" }, // Shiguang Dailiren
  { id: 48643, type: "anime" }, // Koi wa Sekai Seifuku no Ato de
  { id: 157874, type: "manga" }, // Love agency
  { id: 35484, type: "anime" }, // Osake wa Fuufu ni Natte kara
  { id: 50709, type: "anime" }, // Lycoris Recoil
  { id: 14833, type: "anime" }, // Maoyuu Maou Yuusha
  { id: 52211, type: "anime" }, // Mashle
  { id: 8460, type: "anime" }, // Mirai Nikki
  { id: 53865, type: "anime" }, // Yozakura-san Chi no Daisakusen
  { id: 32182, type: "anime" }, // Mob Psycho 100
  { id: 52934, type: "anime" }, // moi le maitre des interdits
  { id: 37430, type: "anime" }, // Tensei shitara Slime Datta Ken
  { id: 5081, type: "anime" }, // bakemonogatari
  { id: 19, type: "anime" }, // Monster
  { id: 39535, type: "anime" }, // Mushoku Tensei: Isekai Ittara Honki Dasu
  { id: 58426, type: "anime" }, // Shikanoko Nokonoko Koshitantan
  { id: 48736, type: "anime" }, // Sono Bisque Doll wa Koi wo Suru
  { id: 34403, type: "anime" }, // Hajimete no Gal
  { id: 51552, type: "anime" }, // Watashi no Shiawase na Kekkon
  { id: 31964, type: "anime" }, // Boku no Hero Academia
  { id: 53126, type: "anime" }, // Yamada-kun to Lv999 no Koi wo Suru
  { id: 49470, type: "anime" }, // my daughter's mother is my ex
  { id: 58272, type: "anime" }, // Boku no Tsuma wa Kanjou ga Nai
  { id: 18897, type: "anime" }, // Nisekoi
  { id: 52608, type: "anime" }, // noble new worlds adventures
  { id: 19815, type: "anime" }, // No Game No Life
  { id: 21, type: "anime" }, // One Piece Movie 0
  { id: 30276, type: "anime" }, // One Punch Man
  { id: 32729, type: "anime" }, // Orange
  { id: 14813, type: "anime" }, // Yahari Ore no Seishun Love Comedy wa Machigatteiru.
  { id: 52034, type: "anime" }, // [Oshi no Ko]
  { id: 52990, type: "anime" }, // Keikenzumi na Kimi to, Keiken Zero na Ore ga, Otsukiai suru Hanashi.
  { id: 22535, type: "anime" }, // Parasite
  { id: 131446, type: "manga" }, // partners2.0
  { id: 171476, type: "manga" }, //  pleure pour cette fleur
  { id: 58822, type: "anime" }, // possibly the greatest alchemist
  { id: 54968, type: "anime" }, // Giji Harem
  { id: 53516, type: "anime" }, // Tensei shitara Dainana Ouji Datta node, Kimama ni Majutsu wo Kiwamemasu
  { id: 56690, type: "anime" }, // Re:Monster
  { id: 40839, type: "anime" }, // Kanojo, Okarishimasu
  { id: 31240, type: "anime" }, // Re:Zero 
  { id: 53879, type: "anime" }, // Kamonohashi Ron no Kindan Suiri
  { id: 54744, type: "anime" }, // Tokidoki Bosotto Russia-go de Dereru Tonari no Alya-san
  { id: 37965, type: "anime" }, // Kaze ga Tsuyoku Fuiteiru
  { id: 59791, type: "anime" }, // Ruri no Houseki
  { id: 39026, type: "anime" }, // dumbell nan kilo moteru?
  { id: 530, type: "anime" }, // Bishoujo Senshi Sailor Moon
  { id: 52082, type: "anime" }, // Shiro Seijo to Kuro Bokushi
  { id: 58939, type: "anime" }, // Sakamoto Days
  { id: 32542, type: "anime" }, // Sakamoto desu ga?
  { id: 38992, type: "anime" }, // Rikei ga Koi ni Ochita no de Shoumei shitemita.
  { id: 54855, type: "anime" }, // Senpai wa Otokonoko
  { id: 26243, type: "anime" }, // Owari no Seraph
  { id: 23755, type: "anime" }, // Nanatsu no Taizai
  { id: 56352, type: "anime" }, // Loop 7-kaime no Akuyaku Reijou wa, Moto Tekikoku de Jiyuu Kimama na Hanayome Seikatsu wo Mankitsu suru
  { id: 45613, type: "anime" }, // Kawaii dake ja Nai Shikimori-san
  { id: 37984, type: "anime" }, // Kumo desu ga, Nani ka?
  { id: 52299, type: "anime" }, // Ore dake Level Up na Ken
  { id: 3588, type: "anime" }, // Soul Eater
  { id: 51122, type: "anime" }, // Ookami to Koushinryou: Merchant Meets the Wise Wolf
  { id: 50265, type: "anime" }, // Spy x Family
  { id: 53262, type: "anime" }, // Hoshikuzu Telepath
  { id: 60057, type: "anime" }, // Chao Neng Lifang: Chaofan Pian
  { id: 11757, type: "anime" }, // Sword Art Online
  { id: 49778, type: "anime" }, // Kijin Gentoushou
  { id: 54714, type: "anime" }, // Kimi no Koto ga Daidaidaidaidaisuki na 100-nin no Kanojo
  { id: 50739, type: "anime" }, // Otonari no Tenshi-sama ni Itsunomanika Dame Ningen ni Sareteita Ken
  { id: 53450, type: "anime" }, // Xian Wang de Richang Shenghuo 4
  { id: 52578, type: "anime" }, // Boku no Kokoro no Yabai Yatsu
  { id: 53632, type: "anime" }, // Yumemiru Danshi wa Genjitsushugisha
  { id: 48316, type: "anime" }, // Kage no Jitsuryokusha ni Naritakute!
  { id: 166865, type: "manga" }, // the extra’s academy survival guide
  { id: 54846, type: "anime" }, // Aishang Ta de Liyou
  { id: 54234, type: "anime" }, // the girl who forgot her glasses
  { id: 40496, type: "anime" }, // Maou Gakuin no Futekigousha: Shijou Saikyou no Maou no Shiso, Tensei shite Shison-tachi no Gakkou e Kayou
  { id: 13759, type: "anime" }, // Sakura-sou no Pet na Kanojo
  { id: 38101, type: "anime" }, // 5-toubun no Hanayome
  { id: 35790, type: "anime" }, // Tate no Yuusha no Nariagari
  { id: 47790, type: "anime" }, // Sekai Saikou no Ansatsusha, Isekai Kizoku ni Tensei suru
  { id: 687, type: "anime" }, // Tokyo Mew Mew
  { id: 50273, type: "anime" }, // Tomodachi Game
  { id: 41389, type: "anime" }, // Tonikaku Kawaii
  { id: 4224, type: "anime" }, // Toradora!
  { id: 40615, type: "anime" }, // Umibe no Étranger
  { id: 52741, type: "anime" }, // Undead Unluck
  { id: 51213, type: "anime" }, // Kinsou no Vermeil: Gakeppuchi Majutsushi wa Saikyou no Yakusai to Mahou Sekai wo Tsukisusumu
  { id: 37521, type: "anime" }, // Vinland Saga
  { id: 33352, type: "anime" }, // Violet Evergarden
  { id: 54233, type: "anime" }, // Sasayaku You ni Koi wo Utau
  { id: 54900, type: "anime" }, // Wind Breaker
  { id: 43299, type: "anime" }, // Wonder Egg Priority
  { id: 38349, type: "anime" }, // Wotaku ni Koi wa Muzukashii OVA
  { id: 23273, type: "anime" }, // Shigatsu wa Kimi no Uso
  { id: 37976, type: "anime" }, // Zombieland Saga

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
