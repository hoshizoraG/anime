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

/* ==================== Récupération anime OU manga (fallback) ==================== */
async function fetchById(id) {
    try {
        // Essaye en tant qu'anime
        let res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
        let data = await res.json();
        if (data?.data) return { ...data.data, _type: "anime" };

        // Si pas trouvé → Essaye en tant que manga
        res = await fetch(`https://api.jikan.moe/v4/manga/${id}`);
        data = await res.json();
        if (data?.data) return { ...data.data, _type: "manga" };

        return null;
    } catch (e) {
        console.error("Erreur récupération ID:", id, e);
        return null;
    }
}

/* ==================== Récupération de la liste ==================== */
async function fetchMyAnimes() {
    try {
        const requests = myAnimeList.map(id => fetchById(id));
        const results = await Promise.all(requests);
        return results.filter(item => item !== null && item !== undefined);
    } catch (error) {
        console.error("Erreur récupération liste:", error);
        return [];
    }
}

/* ==================== Génération de la galerie ==================== */
async function generateAnimeGallery(genreFilter = null) {
    const carousel = document.getElementById('carousel-inner-all');
    const animes = await fetchMyAnimes();

    if (!animes || animes.length === 0) {
        carousel.innerHTML = "<p style='color:red'>Aucun anime/manga trouvé.</p>";
        return;
    }

    // Fusionner par titre "propre" pour éviter doublons (saisons)
    const grouped = {};
    animes.forEach(a => {
        const key = normalizeTitle(a.title || a.title_english || a.title_japanese || "");
        if (!grouped[key]) grouped[key] = a;
    });

    // Filtrer par genre/thème si demandé
    const filtered = Object.values(grouped).filter(anime => {
        if (!genreFilter) return true;
        const allLabels = [
            ...(anime.genres || []).map(g => g.name.toLowerCase()),
            ...(anime.themes || []).map(t => t.name.toLowerCase())
        ];
        return allLabels.includes(genreFilter.toLowerCase());
    });

    carousel.innerHTML = '';
    if (filtered.length === 0) {
        carousel.innerHTML = "<p style='color:red'>Aucun résultat pour ce genre.</p>";
        return;
    }

    // Créer les vignettes
    filtered.forEach(anime => {
        const item = document.createElement('div');
        item.className = 'anime-item';
        item.onclick = () => showAnimeDetails(anime);

        const imgSrc = anime.images?.jpg?.image_url || anime.images?.webp?.image_url || '';

        item.innerHTML = `
            <img src="${imgSrc}" alt="${escapeHtml(anime.title || '')}">
            <p>${escapeHtml(anime.title || '')}</p>
            <p style="font-size: 0;">${escapeHtml(anime.title_english || anime.title_japanese || '')}</p>
        `;
        carousel.appendChild(item);
    });
}

/* ==================== Affichage des détails (sans episodes ni score) ==================== */
function showAnimeDetails(anime) {
    // Masque l'interface galerie
    const searchContainer = document.getElementById('search-container');
    if (searchContainer) searchContainer.style.display = 'none';
    const header = document.getElementById('header');
    if (header) header.style.display = 'none';
    const carousel = document.querySelector('#carousel');
    if (carousel) carousel.style.display = 'none';

    // Contenu detail
    const imgEl = document.getElementById('anime-img');
    if (imgEl) imgEl.src = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || '';

    document.getElementById('anime-title').innerText = anime.title || '';
    document.getElementById('anime-synopsis').innerText = anime.synopsis || "Pas de synopsis disponible";

    // **ICI ON N'AFFICHE PLUS LES EPISODES NI LA NOTE**
    document.getElementById('anime-info').innerHTML = `
        <p>Type: ${escapeHtml(anime.type || 'Inconnu')}</p>
    `;

    document.getElementById('anime-movie-label').innerHTML = anime.type === "Movie" ? "<strong>C'est un Film</strong>" : "";

    // Persos : anime ou manga selon _type
    fetchCharacters(anime.mal_id, anime._type);

    // Affiche le panneau détails
    const animeDetails = document.getElementById('anime-details');
    if (animeDetails) {
        animeDetails.classList.add('show');
        animeDetails.scrollIntoView({ behavior: 'smooth' });
    }
}

/* ==================== Fermeture ==================== */
function closeDetails() {
    const animeDetails = document.getElementById('anime-details');
    if (animeDetails) animeDetails.classList.remove('show');
    const carousel = document.querySelector('#carousel');
    if (carousel) carousel.style.display = 'flex';
    const header = document.getElementById('header');
    if (header) header.style.display = 'flex';
    const searchContainer = document.getElementById('search-container');
    if (searchContainer) searchContainer.style.display = 'block';
}

/* ==================== Recherche locale ==================== */
function searchAnime() {
    const query = (document.getElementById('search-bar')?.value || '').toLowerCase().replace(/\s+/g, '');
    const carousel = document.getElementById('carousel-inner-all');
    if (!carousel) return;
    const items = carousel.querySelectorAll('.anime-item');
    let hasVisibleItems = false;

    items.forEach(item => {
        const title = (item.querySelector('p')?.innerText || '').toLowerCase().replace(/\s+/g, '');
        const aliasElement = item.querySelectorAll('p')[1];
        const aliases = aliasElement ? aliasElement.innerText.toLowerCase().replace(/\s+/g, '') : '';
        if (title.includes(query) || aliases.includes(query)) {
            item.style.display = 'block';
            hasVisibleItems = true;
        } else {
            item.style.display = 'none';
        }
    });

    const noResultsMessage = carousel.querySelector('.no-results-message');
    if (noResultsMessage) noResultsMessage.style.display = hasVisibleItems ? 'none' : 'block';
}

function clearSearch() {
    const sb = document.getElementById('search-bar');
    if (sb) sb.value = '';
    searchAnime();
}

/* ==================== Persos (anime ET manga) ==================== */
async function fetchCharacters(id, type) {
    try {
        if (!id || !type) return;
        const response = await fetch(`https://api.jikan.moe/v4/${type}/${id}/characters`);
        const data = await response.json();
        const characters = data.data || [];

        const charactersList = document.getElementById('anime-characters');
        if (!charactersList) return;
        charactersList.innerHTML = '';

        if (characters.length > 0) {
            characters.slice(0, 4).forEach(c => {
                const img = document.createElement('img');
                img.src = c.character?.images?.jpg?.image_url || c.character?.images?.webp?.image_url || '';
                img.alt = c.character?.name || '';
                img.title = c.character?.name || '';
                charactersList.appendChild(img);
            });
        } else {
            charactersList.innerHTML = "<p>Aucun personnage trouvé</p>";
        }
    } catch (error) {
        console.error("Erreur récupération persos:", error);
    }
}

/* ==================== Helpers ==================== */
function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, s => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    })[s]);
}

/* ==================== Init ==================== */
document.addEventListener("DOMContentLoaded", () => {
    const genre = document.body.dataset.genre || null;
    generateAnimeGallery(genre);
});
