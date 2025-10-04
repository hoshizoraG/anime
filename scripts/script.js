/* ==================== Liste de tes animes vus (MAL IDs) ==================== */
const myAnimeList = [
    41457, //86
    11061, // Hunter x Hunter (2011)
    5114,  // Fullmetal Alchemist: Brotherhood
    1535,  // Death Note
    16498, // Shingeki no Kyojin
    57181, // Blue Box
    50425, // More Than a Married Couple, But Not Lovers
	30831, //konosuba
	51705, // a galaxy next door
	29803, // overlord
	37105, // Grand blue
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

/* ==================== Récupération des animes vus ==================== */
async function fetchMyAnimes() {
    try {
        const requests = myAnimeList.map(id =>
            fetch(`https://api.jikan.moe/v4/anime/${id}`)
                .then(res => res.json())
                .catch(() => null)
        );
        const results = await Promise.all(requests);
        // Filtrer les résultats valides
        return results
            .map(r => r?.data)
            .filter(anime => anime !== undefined && anime !== null);
    } catch (error) {
        console.error("Erreur récupération anime:", error);
        return [];
    }
}

/* ==================== Génération de la galerie ==================== */
async function generateAnimeGallery(genreFilter = null) {
    const carousel = document.getElementById('carousel-inner-all');
    const animes = await fetchMyAnimes();

    if (!animes || animes.length === 0) {
        carousel.innerHTML = "<p style='color:red'>Aucun anime trouvé dans ta liste.</p>";
        return;
    }

    // Fusionner par titre "propre" pour éviter les doublons
    const grouped = {};
    animes.forEach(anime => {
        const key = normalizeTitle(anime.title);
        if (!grouped[key]) grouped[key] = anime;
    });

    // Filtrer par genre/thème si nécessaire
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
        carousel.innerHTML = "<p style='color:red'>Aucun anime trouvé pour ce genre.</p>";
        return;
    }

    // Créer les éléments de la galerie
    filtered.forEach(anime => {
        const item = document.createElement('div');
        item.classList.add('anime-item');
        item.onclick = () => showAnimeDetails(anime);

        item.innerHTML = `
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
            <p>${anime.title}</p>
            <p style="font-size: 0;">${anime.title_english || anime.title_japanese || ''}</p>
        `;
        carousel.appendChild(item);
    });
}

/* ==================== Affichage des détails ==================== */
function showAnimeDetails(anime) {
    document.getElementById('search-container').style.display = 'none';
    document.getElementById('header').style.display = 'none';
    document.querySelector('#carousel').style.display = 'none';

    document.getElementById('anime-img').src = anime.images.jpg.large_image_url;
    document.getElementById('anime-title').innerText = anime.title;
    document.getElementById('anime-synopsis').innerText = anime.synopsis || "Pas de synopsis disponible";

    // Infos simplifiées
    document.getElementById('anime-info').innerHTML = `
        <p>Type: ${anime.type || 'Inconnu'}</p>
        <p>Épisodes: ${anime.episodes || 'Inconnu'}</p>
        <p>Score: ${anime.score || 'Non noté'}</p>
    `;

    document.getElementById('anime-movie-label').innerHTML = anime.type === "Movie" ? "<strong>C'est un Film</strong>" : "";

    fetchCharacters(anime.mal_id);

    const animeDetails = document.getElementById('anime-details');
    animeDetails.classList.add('show');
    animeDetails.scrollIntoView({ behavior: 'smooth' });
}

/* ==================== Fermeture des détails ==================== */
function closeDetails() {
    const animeDetails = document.getElementById('anime-details');
    animeDetails.classList.remove('show');
    document.querySelector('#carousel').style.display = 'flex';
    document.getElementById('header').style.display = 'flex';
    document.getElementById('search-container').style.display = 'block';
}

/* ==================== Recherche locale ==================== */
function searchAnime() {
    const query = document.getElementById('search-bar').value.toLowerCase().replace(/\s+/g, '');
    const carousel = document.getElementById('carousel-inner-all');
    const items = carousel.querySelectorAll('.anime-item');
    let hasVisibleItems = false;

    items.forEach(item => {
        const title = item.querySelector('p').innerText.toLowerCase().replace(/\s+/g, '');
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
    document.getElementById('search-bar').value = '';
    searchAnime();
}

/* ==================== Récupération des personnages ==================== */
async function fetchCharacters(animeId) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`);
        const data = await response.json();
        const characters = data.data;

        const charactersList = document.getElementById('anime-characters');
        charactersList.innerHTML = '';

        characters.slice(0, 6).forEach(c => {
            const img = document.createElement('img');
            img.src = c.character.images.jpg.image_url;
            img.alt = c.character.name;
            img.title = c.character.name;
            charactersList.appendChild(img);
        });
    } catch (error) {
        console.error("Erreur récupération personnages:", error);
    }
}

/* ==================== Initialisation ==================== */
document.addEventListener("DOMContentLoaded", () => {
    // Détecte le genre à partir du body ou d'un attribut data-genre
    const genre = document.body.dataset.genre || null;
    generateAnimeGallery(genre);
});
