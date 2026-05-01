document.addEventListener('DOMContentLoaded',()=>{
    const url = new URLSearchParams(window.location.search);
    const slug = url.get('slug');
    renderPage(slug)
    getCast(slug)
})


const searchInput = document.querySelector('#search-input')
const searchRes = document.querySelector('#search-results')
const searchButton = document.querySelector('.search-box button')
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
searchInput.addEventListener('keydown',(e)=>{
    if(e.key==='Enter'){
        e.preventDefault()
        goSearchPage(searchInput.value.trim())
    }
})
searchButton?.addEventListener('click',()=>{
    goSearchPage(searchInput.value.trim())
})
document.addEventListener('click',(e)=>{
    if(!searchInput.contains(e.target) && !searchRes.contains(e.target)){
        searchRes.style.display = 'none';
    }
})
function goWatchPage(slug){
    window.location.href = `../Watch_movie_page/index.html?slug=${slug}`

}
function goSearchPage(keyword){
    if(!keyword){
        return
    }
    window.location.href = `../Search_page/index.html?keyword=${encodeURIComponent(keyword)}`
}
const seasonsSection = document.querySelector('.seasons-section')
const renderPage = async(slug)=>{
    try{
        const response = await fetch(`https://ophim1.com/v1/api/phim/${slug}`)
        const data = await response.json()
        const movie = data.data.item;
        const episodes = movie.episodes[0].server_data;
        const imageDomain = data.data.APP_DOMAIN_CDN_IMAGE
        const imagePath = data.data.seoOnPage.og_image[0];
        const fullImageURL = `${imageDomain}/uploads/${imagePath}`;
        const times = data.data.item.time.split('/');
        const time = " "+times[0]
        const number = data.data.item.tmdb.season
        if(episodes.length>1){
            renderChapter(episodes,fullImageURL,time,number)
        }
        else{
            seasonsSection.style.display = 'none';
        }
        renderVideo(episodes,0)
        renderInfor(movie)
        
    }
    catch(error){
        console.log(error)
    }
}
const chapter = document.querySelector('#movie_title2')
function renderCurrentChapter(index){
    let x = parseInt(index) + 1
    const content = `Tập ${x}`
    chapter.textContent = content
    const currentChapter = document.querySelectorAll('.season-card')
    currentChapter.forEach((value,index1)=>{
        if(index1==index){
            value.style.backgroundColor = "#262626"
            value.onmouseenter = null; 
            value.onmouseleave = null;
        }
        else{
            value.style.backgroundColor = "#26262600"
            value.onmouseenter = function() {
                this.style.backgroundColor = "#1A1A1A"; 
                this.style.cursor = "pointer"; 
            };
            value.onmouseleave = function() {
                this.style.backgroundColor = "transparent"; 
            };
        }
    })

}
const video = document.querySelector('#video')
function renderVideo(chapter,index){
    video.innerHTML = ''
    if(chapter.length>1){
        renderCurrentChapter(index)
        
    }
    
    const src = chapter[index].link_embed
    if(src==''){
        video.innerHTML = `<img src="../../asset/error.png" alt="" style="width="100%"
                            height="100%" margin = auto">`
    }
    else{
        video.innerHTML = `<iframe
                            width="100%"
                            height="100%"
                            src ="${src}"
                            frameborder="0"
                            allow="autoplay; encrypted-media; picture-in-picture; web-share"
                            allowfullscreen>
                        </iframe>`
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
}
const title = document.querySelector('#movie_title')
const desc = document.querySelector('#movie_description')
const released = document.querySelector('#released')
const lang = document.querySelector('#lang')
const rate = document.querySelector('#rate')
const genres = document.querySelector('.genres-tags')
const cast = document.querySelector('.cast-list')
const progress = document.querySelector('#progress')
function renderInfor(movie){
    title.textContent = movie.name
    desc.innerHTML = movie.content
    released.textContent = movie.year
    lang.textContent = movie.lang
    progress.textContent = movie.episode_current
    rate.textContent = "IMDb "+movie.imdb.vote_average
    const categories = movie.category
    const html = categories.map((item)=>{
        return `<span class="tag">${item.name}</span>`
    }).join('')
    genres.innerHTML = html
}
const getCast = async(slug)=>{
    try{
        const response = await fetch(`https://ophim1.com/v1/api/phim/${slug}/peoples`)
        const data = await response.json()
        const baseUrl = data.data.profile_sizes.w185;
        const peoples = data.data.peoples
        renderCastList(peoples,baseUrl)
    }catch(error){
        console.log(error)
    }
}
function renderCastList (peoples,baseUrl){
    const html = peoples.map((item)=>{
        let name
        if(item.name.length>10){
            name = item.name.slice(0,10)+'...'
        }
        else{
            name = item.name
        }
        if(!item.profile_path){
            return `<div class="cast-item"><img src="../../asset/avt.png" alt="">${name}</div>`
        }
        else{
            const fullImageUrl = baseUrl + item.profile_path
            return `<div class="cast-item"><img src="${fullImageUrl}" alt="">${item.name}</div>`
        }
        
    }).join('')
    cast.innerHTML= html
}
const seasonNumber = document.querySelector('#seasonNumber')
function renderSeason(number){
    seasonNumber.textContent = "Season "+number
}
const seasonsList = document.querySelector('.seasons-list')
function renderChapter(chaps, fullImageURL,time,number){
    renderSeason(number)
    window.allEpisodes = chaps;
    const html = chaps.map((chap)=>{
        const parts = chap.filename.split('_');
        const episodeTitle = parts[parts.length - 1];
        const title = "Chapter "+chap.name+ ": "+ episodeTitle
        let chapter
        if(chap.name.length<2){
            chapter = "0"+chap.name
        }
        else{
            chapter = chap.name
        }
        return `<div class="season-card" onclick="renderVideo(window.allEpisodes,'${chap.name-1}')">
                            <div class="season-card__number">${chapter}</div>
                            <div class="season-card__img">
                                <img src="${fullImageURL}" alt="${chap.name}">
                            </div>
                            <div class="season-card__info">
                                <div class="card-info__header">
                                    <h4>${title}</h4>
                                    <span class="duration"><i class="fa-regular fa-clock"></i>${time}</span>
                                </div>
                            </div>
                        </div>`
    }).join('')
    seasonsList.innerHTML = html
}
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.querySelector('#mobile-menu');
    const navLinks = document.querySelector('#nav-links');
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', function() {
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
    document.addEventListener('click', function(event) {
        if (!mobileMenu.contains(event.target) && !navLinks.contains(event.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenu.querySelector('i').classList.remove('fa-times');
            mobileMenu.querySelector('i').classList.add('fa-bars');
        }
    });
});
