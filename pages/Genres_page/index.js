let slug
document.addEventListener('DOMContentLoaded',()=>{
    const url = new URLSearchParams(window.location.search);
    slug = url.get('slug')
    getMovie(slug)
})

const searchInput = document.querySelector('#search-input')
const searchRes = document.querySelector('#search-results')
let debounceTimeout = null;
const getSearchMovie = async(key)=>{
    if(!key){
        searchRes.style.display = 'none'
        return
    }
    try{
        const response = await fetch(`https://ophim1.com/v1/api/tim-kiem?keyword=${key}`)
        const datas = await response.json()
        const imageDomain = datas.data.APP_DOMAIN_CDN_IMAGE
        const movies = datas.data.items;
        renderSearchMovie(movies,imageDomain)
    }catch(error){
        console.log(error)
    }
}
function renderSearchMovie(movies,imageDomain){
    if(!movies||movies.length==0){
        searchRes.innerHTML = '<div style="padding:15px; text-align:center; color:#999; font-size:12px">Không tìm thấy phim</div>';
        searchRes.style.display = 'block'
        return;
    }
    const htmlContent = movies.map(item=>{
        const thumb_url = `${imageDomain}/uploads/movies/${item.thumb_url}`;
        
        return `
            <div class="search-item" onclick="goWatchPage('${item.slug}')">
                <img src="${thumb_url}" alt="${item.name}">
                <div class="search-info">
                    <div class="search-title">${item.name}</div>
                    <div class="search-meta">${item.origin_name} (${item.year})</div>
                    <div class="search-meta1">${item.time}</div>
                    <div class="search-meta2">${item.slug}</div>
                </div>
            </div>
        `
    }).join('')
    searchRes.innerHTML = htmlContent
    searchRes.style.display = 'block'
}
searchInput.addEventListener('input',(e)=>{
    const key = e.target.value.trim()
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(()=>{
        getSearchMovie(key);
    },500)
})
document.addEventListener('click',(e)=>{
    if(!searchInput.contains(e.target) && !searchRes.contains(e.target)){
        searchRes.style.display = 'none';
    }
})
function goWatchPage(slug){
    window.location.href = `/pages/Watch_movie_page/index.html?slug=${slug}`
}

const mediaGrid = document.querySelector('.media-grid')
const genreTitle = document.querySelector('.section-title')
let index = 1
let max
const getMovie = async(slug)=>{
    try{
        const response = await fetch(`https://ophim1.com/v1/api/the-loai/${slug}?page=${index}&limit=20`)
        const data = await response.json()
        const imageDomain = data.data.APP_DOMAIN_CDN_IMAGE
        const movies = data.data.items;
        max =  Math.floor(data.data.params.pagination.totalItems/20 + 1)
        updateButtons()
        genreTitle.textContent = data.data.seoOnPage.titleHead
        renderMovie(movies,imageDomain)
    }
    catch(error){
        console.log(error);
    }
}

function renderMovie(movies,imageDomain){
    const htmlContent = movies.map((movie)=>{
        const thumb_url = `${imageDomain}/uploads/movies/${movie.thumb_url}`;
        const date = new Date(movie.modified.time);
                const formattedDate = date.toLocaleDateString('en-GB');
        return `<div class="movie-card" onclick="goWatchPage('${movie.slug}')">
                        <div class="movie-poster-wrapper">
                            <img src="${thumb_url}" alt="Movie">
                        </div>
                        <h4 class="movie-title">${movie.name}</h4>
                        <div class="release-badge">Updated ${formattedDate}</div>
                    </div>`
    }).join('')
    mediaGrid.innerHTML = htmlContent;
}
const btnLeft = document.querySelector('#new-releases-left')
const btnRight = document.querySelector('#new-releases-right')
function updateButtons(){
    if(index==1){
        btnLeft.style.opacity = "0.5";
        btnLeft.disabled = true;
    }
    else{
        btnLeft.style.opacity = "1";
        btnLeft.disabled = false;
    }
    if(index==max){
        btnRight.style.opacity = "0.5";
        btnRight.disabled = true;
    }
    else{
        btnRight.style.opacity = "1";
        btnRight.disabled = false;
    }
}
btnLeft.addEventListener('click',()=>{
    index--
    getMovie(slug)
    updateButtons()
})
btnRight.addEventListener('click',()=>{
    index++
    getMovie(slug)
    updateButtons()
})