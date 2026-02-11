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

const getMovieData = async (slug) => {
    try {
        const response = await fetch(`https://ophim1.com/v1/api/the-loai/${slug}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};
const grid1 = document.querySelector(".media-grid1")
function renderMovieSlug(slug,name){
    getMovieData(slug).then((apiResult)=>{
        const box = document.createElement('div');
        box.innerHTML='';
        const imageDomain = apiResult.data.APP_DOMAIN_CDN_IMAGE;
        const thumbUrl1 = `${imageDomain}/uploads/movies/${apiResult.data.items[0].thumb_url}`;
        const thumbUrl2 = `${imageDomain}/uploads/movies/${apiResult.data.items[1].thumb_url}`;
        const thumbUrl3 = `${imageDomain}/uploads/movies/${apiResult.data.items[2].thumb_url}`;
        const thumbUrl4 = `${imageDomain}/uploads/movies/${apiResult.data.items[3].thumb_url}`;
        const boxContent = `<div class="genre-card" onClick="goGenresPage('${slug}')">
                        <div class="genre-images-grid">
                            <img src="${thumbUrl1}" class="genre-img-item" alt="${slug}">
                            <img src="${thumbUrl2}" class="genre-img-item" alt="${slug}">
                            <img src="${thumbUrl3}" class="genre-img-item" alt="${slug}">
                            <img src="${thumbUrl4}" class="genre-img-item" alt="${slug}">
                        </div>
                        <div class="genre-footer">
                            <span>${name}</span> <i class="fas fa-arrow-right"></i>
                        </div>
                    </div>`
        box.innerHTML = boxContent;
        grid1.appendChild(box)
        updateButtons()
    })
}

const genresLeft = document.querySelector('#genres-left')
const genresRight = document.querySelector('#genres-right')
const getSlugData = async ()=>{
    try{
        const response = await fetch(`https://ophim1.com/v1/api/the-loai`);
        const slugs = await response.json();
        const allGenres = slugs.data.items.filter(item => item.slug != 'phim-18');
        grid1.innerHTML=''
        for(let i = 0;i<allGenres.length;i++){
            renderMovieSlug(allGenres[i].slug,allGenres[i].name)
        }
    }catch(error){
        console.error(error);
    }
}


function updateButtons() {
    const maxScrollLeft = grid1.scrollWidth - grid1.clientWidth;
    genresLeft.style.opacity = grid1.scrollLeft <= 10 ? "0.5" : "1";
    genresLeft.disabled = grid1.scrollLeft <= 10;
    const isEnd = grid1.scrollLeft >= maxScrollLeft - 10;
    genresRight.style.opacity = isEnd ? "0.5" : "1";
    genresRight.disabled = isEnd;
}

genresRight.addEventListener('click', () => {
    grid1.scrollBy({
        left: grid1.clientWidth, 
        behavior: 'smooth'
    });
});

genresLeft.addEventListener('click', () => {
   grid1.scrollBy({
        left: -grid1.clientWidth, 
        behavior: 'smooth'
    });
});
grid1.addEventListener('scroll', updateButtons);
getSlugData()


function closeBanner() {
    const banner = document.getElementById('floating-banner');
    const overlay = document.getElementById('overlay')
    if (banner) {
        banner.style.display = 'none'; 
        overlay.style.display = 'none';
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const closeBtn = document.querySelector('.btn-close-banner');
    let s = 10
    const countDown=setInterval(()=>{
        closeBtn.style.display = 'flex'; 
        closeBtn.textContent = s
        s--
        if(s<0){
            clearInterval(countDown);
            closeBtn.textContent = "X";
            closeBtn.addEventListener('click',closeBanner)
        }
    },1000)
});
function goGenresPage(slug){
    window.location.href = `/pages/Genres_page/index.html?slug=${slug}`
}