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
        console.log(apiResult.data.items)
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
renderMovie('tinh-cam')
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
    })
}


const getSlugData = async ()=>{
    try{
        const response = await fetch(`https://ophim1.com/v1/api/the-loai`);
        const slugs = await response.json();
        return slugs;
    }catch(error){
        console.error(error);
    }
}

function renderOurGenres(index){
    getSlugData().then((slugs) => {
        console.log(slugs)
        const safeSlugs = slugs.data.items.filter(item => item.slug != 'phim-18');
        for(let i = index;i<index+5;i++){
            renderMovieSlug(safeSlugs[i].slug,safeSlugs[i].name)
        }
    })
}
renderOurGenres(0)