// ======== Liste de tes animes vus (MAL IDs) ========
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
];

// ======== Normalisation du titre ========
function normalizeTitle(title) {
    return title
        .toLowerCase()
        .replace(/\(.*?\)/g, "")
        .replace(/season \d+/g, "")
        .replace(/part \d+/g, "")
        .trim();
}

// ======== Récupération des animes ========
async function fetchMyAnimes() {
    try {
        const requests = myAnimeList.map(id =>
            fetch(`https://api.jikan.moe/v4/anime/${id}`).then(res => res.json())
        );
        const results = await Promise.all(requests);
        return results.map(r => r.data);
    } catch (error) {
        console.error("Erreur récupération anime:", error);
        return [];
    }
}

// ======== Génération de la galerie ========
async function generateAnimeGallery(genreFilter = null) {
    const carousel = document.getElementById('carousel-inner-all');
    const animes = await fetchMyAnimes();

    if (!animes || !animes.length) {
        carousel.innerHTML = "<p style='color:red'>Aucun anime trouvé.</p>";
        return;
    }

    const grouped = {};
    animes.forEach(anime => {
        const key = normalizeTitle(anime.title);
        if (!grouped[key]) grouped[key] = anime;
    });

    carousel.innerHTML = '';
    const filtered = Object.values(grouped).filter(anime => {
        if (!genreFilter) return true;
        const allLabels = [
            ...(anime.genres || []).map(g => g.name.toLowerCase()),
            ...(anime.themes || []).map(t => t.name.toLowerCase())
        ];
        return allLabels.includes(genreFilter.toLowerCase());
    });

    if (!filtered.length) {
        carousel.innerHTML = "<p style='color:red'>Aucun anime trouvé pour ce genre.</p>";
        return;
    }

    filtered.forEach(anime => {
        const item = document.createElement('div');
        item.classList.add('anime-item');
        item.onclick = () => showAnimeDetails(anime);

        item.innerHTML = `
            <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
            <p>${anime.title}</p>
            <p style="font-size:0;">${anime.title_english || anime.title_japanese || ''}</p>
        `;
        carousel.appendChild(item);
    });
}

// ======== Affichage des détails ========
async function showAnimeDetails(anime) {
    document.getElementById('search-container').style.display = 'none';
    document.getElementById('header').style.display = 'none';
    document.querySelector('#carousel').style.display = 'none';

    document.getElementById('anime-img').src = anime.images.jpg.large_image_url;
    document.getElementById('anime-title').innerText = anime.title;
    document.getElementById('anime-synopsis').innerText = anime.synopsis || "Pas de synopsis disponible";

    document.getElementById('anime-info').innerHTML = `
        <p>Type: ${anime.type || 'Inconnu'}</p>
        <p>Score: ${anime.score || 'Non noté'}</p>
    `;

    document.getElementById('anime-movie-label').innerHTML = anime.type === "Movie" ? "<strong>C'est un Film</strong>" : "";

    await fetchCharacters(anime.mal_id);

    const animeDetails = document.getElementById('anime-details');
    animeDetails.classList.add('show');
    animeDetails.scrollIntoView({ behavior: 'smooth' });
}

// ======== Fermeture des détails ========
function closeDetails() {
    document.getElementById('anime-details').classList.remove('show');
    document.querySelector('#carousel').style.display = 'flex';
    document.getElementById('header').style.display = 'flex';
    document.getElementById('search-container').style.display = 'block';
}

// ======== Recherche ========
function searchAnime() {
    const query = document.getElementById('search-bar').value.toLowerCase().replace(/\s+/g, '');
    const items = document.querySelectorAll('.anime-item');
    let hasVisibleItems = false;

    items.forEach(item => {
        const title = item.querySelector('p').innerText.toLowerCase().replace(/\s+/g, '');
        const alias = item.querySelectorAll('p')[1]?.innerText.toLowerCase().replace(/\s+/g, '') || '';
        if (title.includes(query) || alias.includes(query)) {
            item.style.display = 'block';
            hasVisibleItems = true;
        } else item.style.display = 'none';
    });

    const noResults = document.querySelector('.no-results-message');
    if (noResults) noResults.style.display = hasVisibleItems ? 'none' : 'block';
}

function clearSearch() {
    document.getElementById('search-bar').value = '';
    searchAnime();
}

// ======== Récupération des personnages ========
async function fetchCharacters(animeId) {
    try {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`);
        const data = await res.json();
        const chars = data.data;
        const container = document.getElementById('anime-characters');
        container.innerHTML = '';
        chars.slice(0,6).forEach(c => {
            const img = document.createElement('img');
            img.src = c.character.images.jpg.image_url;
            img.alt = c.character.name;
            img.title = c.character.name;
            container.appendChild(img);
        });
    } catch (e) { console.error(e); }
}

// ======== Initialisation ========
document.addEventListener("DOMContentLoaded", () => {
    const genre = document.body.dataset.genre || null;
    generateAnimeGallery(genre);
});
