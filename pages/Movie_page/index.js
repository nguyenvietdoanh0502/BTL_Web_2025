const grid = document.querySelector(".media-grid")
const grid1 = document.querySelector(".media-grid1")

const getMovieData = async (slug) => {
  try {
    const response = await fetch(`https://ophim1.com/v1/api/the-loai/${slug}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

function renderMovie(slug){
    getMovieData(slug).then((apiResult) => {
        grid.innerHTML = '';
        const imageDomain = apiResult.data.APP_DOMAIN_CDN_IMAGE;
        const htmlContent = apiResult.data.items.map(item=>{
            
            const thumbUrl = `${imageDomain}/uploads/movies/${item.thumb_url}`;
            return `<div class="movie-card">
                            <div class="movie-poster-wrapper">
                                <img src="${thumbUrl}" alt="Movie">
                            </div>
                            <h4 class="movie-title">${item.name}</h4>
                            <div class="release-badge">Released ${item.year}</div>
                        </div>`
        }).join('')
        grid.innerHTML=htmlContent;
});
}

function renderMovieSlug(slug,name){
    getMovieData(slug).then((apiResult)=>{
        const box = document.createElement('div');
        box.innerHTML='';
        const imageDomain = apiResult.data.APP_DOMAIN_CDN_IMAGE;
        const thumbUrl1 = `${imageDomain}/uploads/movies/${apiResult.data.items[0].thumb_url}`;
        const thumbUrl2 = `${imageDomain}/uploads/movies/${apiResult.data.items[1].thumb_url}`;
        const thumbUrl3 = `${imageDomain}/uploads/movies/${apiResult.data.items[2].thumb_url}`;
        const thumbUrl4 = `${imageDomain}/uploads/movies/${apiResult.data.items[3].thumb_url}`;
        const boxContent = `<div class="genre-card">
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



const getMovieMain = async ()=>{
    try{
        const response = await fetch(`https://ophim1.com/v1/api/home`)
        const movies = await response.json()
        console.log(movies)
        return movies
    }catch(error){
        console.log(error)
    }
}
const getMovieInfo = async (slug)=>{
    try{
        const response = await fetch(`https://ophim1.com/v1/api/phim/${slug}`)
        const infos = await response.json()
        return infos
    }catch(error){
        console.log(error)
    }
}


const hero = document.querySelector('.hero')
const hero_title = document.querySelector('.hero-title')
const hero_desc = document.querySelector('.hero-desc')


function renderMainMovie(){
    getMovieMain().then((movies)=>{
        const imageDomain = movies.data.APP_DOMAIN_CDN_IMAGE;
        let index = 0;
        setInterval(function(){
            if (index >= movies.data.items.length) {
                index = 0;
            }
            const thumbUrl = `${imageDomain}/uploads/movies/${movies.data.items[index].thumb_url}`;
            hero.style.background = `linear-gradient(to top, #141414 5%, rgba(20,20,20,0.6) 60%, rgba(20,20,20,0.2) 100%), 
                        url("${thumbUrl}")`
            hero.style.backgroundRepeat = "no-repeat"; 
            hero.style.backgroundSize = "cover";
            hero.style.backgroundPosition = "center";
            hero_title.textContent = `${movies.data.items[index].name}`
            getMovieInfo(movies.data.items[index].slug).then((infos)=>{
            hero_desc.textContent = infos.data.seoOnPage.descriptionHead
            index++
        })
        },20000)
        
    })
}
renderMainMovie()

const getYearRelease = async()=>{
    try{
        const response = await fetch(`https://ophim1.com/v1/api/nam-phat-hanh`)
        const years = await response.json()
        return years
    }catch(error){
        console.log(error)
    }
}

const getMovieNewRelease = async(year,page)=>{
    try{
        const response = await fetch(`https://ophim1.com/v1/api/nam-phat-hanh/${year}?page=${page}&limit=10`)
        const movies = await response.json()
        return movies
    }catch(error){
        console.log(error)
    }
}

function renderMovieNewReleasePage(year,page){
    console.log(page)
    getMovieNewRelease(year,page).then((movies)=>{
            grid.innerHTML = '';
            console.log(movies.data.items)
            const imageDomain = movies.data.APP_DOMAIN_CDN_IMAGE;
            
            const htmlContent = movies.data.items.map(item=>{
                const date = new Date(item.modified.time);
                const formattedDate = date.toLocaleDateString('en-GB');
                const thumbUrl = `${imageDomain}/uploads/movies/${item.thumb_url}`;
                return `<div class="movie-card">
                                <div class="movie-poster-wrapper">
                                    <img src="${thumbUrl}" alt="Movie">
                                </div>
                                <h4 class="movie-title">${item.name}</h4>
                                <div class="release-badge">Updated ${formattedDate}</div>
                            </div>`
            }).join('')
            grid.innerHTML=htmlContent;
            if(movies.data.items.length<10){
                btnRight.style.opacity = "0.5";
                btnRight.disabled = true;
            }
                
            
        })
}
const btnRight = document.querySelector("#new-releases-right")
const btnLeft = document.querySelector("#new-releases-left")
function renderMovieNewRelease(){
    getYearRelease().then((years)=>{
        let page = 1
        if(page==1){
            btnLeft.style.opacity = "0.5";
            btnLeft.disabled = true;
        }
        else{
            btnLeft.style.opacity = "1";
            btnLeft.disabled = false;
        }
        renderMovieNewReleasePage(years.data.items[0].year,page)
        btnRight.addEventListener('click',()=>{
            page++
            if(page!=1){
                btnLeft.style.opacity = "1";
                btnLeft.disabled = false;
            }
            renderMovieNewReleasePage(years.data.items[0].year,page)
        })
        btnLeft.addEventListener('click',()=>{
                page--
                btnRight.style.opacity = "1";
                btnRight.disabled = false;
                if(page==1){
                    btnLeft.style.opacity = "0.5";
                    btnLeft.disabled = true;
                }
                else{
                    btnLeft.style.opacity = "1";
                    btnLeft.disabled = false;
                }
                renderMovieNewReleasePage(years.data.items[0].year,page)
        })
    })
}
renderMovieNewRelease()


const getAllMovies = async(page)=>{
    try{
        const response = await fetch(`https://ophim1.com/v1/api/danh-sach/?page=${page}&limit=20`)
        const movies = response.json()
        return movies
    }catch(error){
        console.log(error)
    }
}


const allMoviesGrid = document.querySelector('#all-movies-grid')
const btnAllMovieRight = document.querySelector('#all-movie-right')
const btnAllMovieLeft = document.querySelector('#all-movie-left')
let currentPage = 1
function renderAllMovies(){
    console.log(currentPage)
    getAllMovies(currentPage).then((movies)=>{
        const imageDomain = movies.data.APP_DOMAIN_CDN_IMAGE;
        const htmlAllMovies=movies.data.items.map(item=>{
            const date = new Date(item.modified.time);
                const formattedDate = date.toLocaleDateString('en-GB');
                const thumbUrl = `${imageDomain}/uploads/movies/${item.thumb_url}`;
                return `<div class="movie-card">
                                <div class="movie-poster-wrapper">
                                    <img src="${thumbUrl}" alt="Movie">
                                </div>
                                <h4 class="movie-title">${item.name}</h4>
                                <div class="release-badge">Updated ${formattedDate}</div>
                            </div>`
        }).join('')
        allMoviesGrid.innerHTML = htmlAllMovies
        checkButton()


    })
                                                                                                                
}
btnAllMovieLeft.addEventListener('click',()=>{
    currentPage--
    renderAllMovies()
    checkButton()
})
btnAllMovieRight.addEventListener('click',()=>{
    currentPage++
    renderAllMovies()
    checkButton()
})
function checkButton(){
    if(currentPage<=1){
        btnAllMovieLeft.style.opacity = "0.5";
        btnAllMovieLeft.disabled = true;
    }
    else{
        btnAllMovieLeft.style.opacity = "1";
        btnAllMovieLeft.disabled = false;
    }
}
renderAllMovies()
const mustWatchGrid = document.querySelector('#must-watch-movies-grid');
let mustWatch = [];
let imageDomain = '';
async function renderMustWatch() {
    
    const promises = [];
    for(let i = 0; i < 100; i++) {
        promises.push(getAllMovies(i));
    }
    try {
        const results = await Promise.all(promises);
        results.forEach(movies => {
            if (movies && movies.data) {
                imageDomain = movies.data.APP_DOMAIN_CDN_IMAGE; 
                const res = movies.data.items.filter(item => {
                    return item.imdb && item.imdb.vote_average >= 8.5;
                });
                mustWatch.push(...res); 
            }
        });
        renderMustWatchGrid(imageDomain);

    } catch (error) {
        console.error(error);
    }
}

const mustWatchLeft = document.querySelector("#must-watch-left")
const mustWatchRight = document.querySelector("#must-watch-right")     
let index = 0      
let check = 0
function renderMustWatchGrid(imageDomain) {
    console.log(mustWatch)
    check = mustWatch.length - mustWatch.length%10
    mustWatch = mustWatch.sort((b,a)=>a.imdb.vote_average - b.imdb.vote_average)
    let htmlContent = ''
    let end = Math.min(index + 10, mustWatch.length);
    console.log(index)
    console.log(end)
    for(let i = index;i<end;i++){
        const thumbUrl = `${imageDomain}/uploads/movies/${mustWatch[i].thumb_url}`;
        htmlContent+=`<div class="movie-card">
                        <div class="movie-poster-wrapper">
                            <img src="${thumbUrl}" alt="Poster">
                        </div>
                        <h4 class="movie-title">${mustWatch[i].name}</h4>
                        <div class="movie-meta">
                            <span><i class="far fa-clock"></i> ${mustWatch[i].time}</span>
                            <span class="rating"><i class="fas fa-star"></i> ${mustWatch[i].imdb.vote_average}</span>
                        </div>
                    </div>`              
    }
    mustWatchGrid.innerHTML = htmlContent;
    checkButton2()
}
renderMustWatch();
mustWatchRight.addEventListener('click',()=>{
    index+=10
    renderMustWatchGrid(imageDomain)
})
mustWatchLeft.addEventListener('click',()=>{
    index-=10
    renderMustWatchGrid(imageDomain)
})
function checkButton2(){
    if(index==0){
        mustWatchLeft.style.opacity = "0.5";
        mustWatchLeft.disabled = true;
    }
    else{
        mustWatchLeft.style.opacity = "1";
        mustWatchLeft.disabled = false;
    }
    if(index==check){
        mustWatchRight.style.opacity = "0.5";
        mustWatchRight.disabled = true;
    }
    else{
        mustWatchRight.style.opacity = "1";
        mustWatchRight.disabled = false;
    }
}