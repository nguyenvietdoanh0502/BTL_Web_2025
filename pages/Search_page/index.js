const searchInput = document.querySelector('#search-input');
const searchRes = document.querySelector('#search-results');
const searchButton = document.querySelector('.search-box button');
const mediaGrid = document.querySelector('.media-grid');
const genreTitle = document.querySelector('.section-title');
const btnLeft = document.querySelector('#new-releases-left');
const btnRight = document.querySelector('#new-releases-right');

let debounceTimeout = null;
let currentKeyword = '';
let page = 1;
let maxPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    const url = new URLSearchParams(window.location.search);
    currentKeyword = (url.get('keyword') || '').trim();

    if (currentKeyword) {
        searchInput.value = currentKeyword;
        loadSearchPage(currentKeyword, page);
    } else {
        genreTitle.textContent = 'Search Results';
        renderEmptyGrid('Please enter a keyword to search movies.');
        updateButtons();
    }

    setupMobileMenu();
});

const getSearchMovie = async (key) => {
    if (!key) {
        searchRes.style.display = 'none';
        return;
    }
    try {
        const response = await fetch(`https://ophim1.com/v1/api/tim-kiem?keyword=${encodeURIComponent(key)}`);
        const datas = await response.json();
        const imageDomain = datas?.data?.APP_DOMAIN_CDN_IMAGE || '';
        const movies = datas?.data?.items || [];
        renderSearchMovie(movies, imageDomain);
    } catch (error) {
        console.log(error);
    }
};

function renderSearchMovie(movies, imageDomain) {
    if (!movies || movies.length === 0) {
        searchRes.innerHTML = '<div style="padding:15px; text-align:center; color:#999; font-size:12px">No movies found</div>';
        searchRes.style.display = 'block';
        return;
    }
    const htmlContent = movies.map((item) => {
        const thumbUrl = `${imageDomain}/uploads/movies/${item.thumb_url}`;
        return `
            <div class="search-item" onclick="goWatchPage('${item.slug}')">
                <img src="${thumbUrl}" alt="${item.name}">
                <div class="search-info">
                    <div class="search-title">${item.name}</div>
                    <div class="search-meta">${item.origin_name} (${item.year})</div>
                    <div class="search-meta1">${item.time}</div>
                    <div class="search-meta2">${item.slug}</div>
                </div>
            </div>
        `;
    }).join('');
    searchRes.innerHTML = htmlContent;
    searchRes.style.display = 'block';
}

searchInput.addEventListener('input', (e) => {
    const key = e.target.value.trim();
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        getSearchMovie(key);
    }, 500);
});

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        goSearchPage(searchInput.value.trim());
    }
});

searchButton?.addEventListener('click', () => {
    goSearchPage(searchInput.value.trim());
});

document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchRes.contains(e.target)) {
        searchRes.style.display = 'none';
    }
});

function goSearchPage(keyword) {
    if (!keyword) {
        return;
    }
    window.location.href = `../Search_page/index.html?keyword=${encodeURIComponent(keyword)}`;
}

function goWatchPage(slug) {
    window.location.href = `../Watch_movie_page/index.html?slug=${slug}`;
}

const loadSearchPage = async (keyword, currentPage) => {
    try {
        const response = await fetch(`https://ophim1.com/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${currentPage}&limit=20`);
        const data = await response.json();
        const imageDomain = data?.data?.APP_DOMAIN_CDN_IMAGE || '';
        const movies = data?.data?.items || [];
        const totalItems = data?.data?.params?.pagination?.totalItems || movies.length;

        maxPage = Math.max(1, Math.ceil(totalItems / 20));
        updateButtons();
        genreTitle.textContent = `Search Results: "${keyword}"`;
        renderMovie(movies, imageDomain);
    } catch (error) {
        console.log(error);
        renderEmptyGrid('Cannot load search results.');
    }
};

function renderMovie(movies, imageDomain) {
    if (!movies || movies.length === 0) {
        renderEmptyGrid('No movies match this keyword.');
        return;
    }
    const htmlContent = movies.map((movie) => {
        const thumbUrl = `${imageDomain}/uploads/movies/${movie.thumb_url}`;
        const date = new Date(movie.modified.time);
        const formattedDate = date.toLocaleDateString('en-GB');
        return `<div class="movie-card" onclick="goWatchPage('${movie.slug}')">
                        <div class="movie-poster-wrapper">
                            <img src="${thumbUrl}" alt="Movie">
                        </div>
                        <h4 class="movie-title">${movie.name}</h4>
                        <div class="release-badge">Updated ${formattedDate}</div>
                    </div>`;
    }).join('');
    mediaGrid.innerHTML = htmlContent;
}

function renderEmptyGrid(message) {
    mediaGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #999; padding: 24px 0;">${message}</p>`;
}

function updateButtons() {
    if (page <= 1) {
        btnLeft.style.opacity = '0.5';
        btnLeft.disabled = true;
    } else {
        btnLeft.style.opacity = '1';
        btnLeft.disabled = false;
    }
    if (page >= maxPage) {
        btnRight.style.opacity = '0.5';
        btnRight.disabled = true;
    } else {
        btnRight.style.opacity = '1';
        btnRight.disabled = false;
    }
}

btnLeft.addEventListener('click', () => {
    if (page <= 1 || !currentKeyword) {
        return;
    }
    page -= 1;
    loadSearchPage(currentKeyword, page);
    updateButtons();
});

btnRight.addEventListener('click', () => {
    if (page >= maxPage || !currentKeyword) {
        return;
    }
    page += 1;
    loadSearchPage(currentKeyword, page);
    updateButtons();
});

function setupMobileMenu() {
    const mobileMenu = document.querySelector('#mobile-menu');
    const navLinks = document.querySelector('#nav-links');
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            const icon = mobileMenu.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    document.addEventListener('click', function (event) {
        if (!mobileMenu.contains(event.target) && !navLinks.contains(event.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenu.querySelector('i').classList.remove('fa-times');
            mobileMenu.querySelector('i').classList.add('fa-bars');
        }
    });
}
