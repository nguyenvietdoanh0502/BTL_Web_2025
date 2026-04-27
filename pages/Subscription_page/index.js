const planGrid = document.querySelector('.pricing-grid')
const btnMonth = document.querySelector('#btn-monthly')
const btnYear = document.querySelector('#btn-yearly')
btnMonth.addEventListener('click',()=>{
    btnMonth.style.background = '#333'
    btnYear.style.background = '#33333300'
    btnYear.style.border = 'none'
    planGrid.innerHTML = `
            <div class="price-card">
                <h3>Basic Plan</h3>
                <p>Enjoy an extensive library of movies and shows, featuring a range of content, including recently released titles.</p>
                <div class="price">$9.99 <span>/month</span></div>
                <div class="price-actions">
                    <button class="btn btn-dark">Start Free Trial</button>
                    <button class="btn btn-primary">Choose Plan</button>
                </div>
            </div>
            <div class="price-card">
                <h3>Standard Plan</h3>
                <p>Access to a wider selection of movies and shows, including most new releases and exclusive content.</p>
                <div class="price">$12.99 <span>/month</span></div>
                <div class="price-actions">
                    <button class="btn btn-dark">Start Free Trial</button>
                    <button class="btn btn-primary">Choose Plan</button>
                </div>
            </div>
            <div class="price-card">
                <h3>Premium Plan</h3>
                <p>Access to a widest selection of movies and shows, including all new releases and Offline Viewing.</p>
                <div class="price">$14.99 <span>/month</span></div>
                <div class="price-actions">
                    <button class="btn btn-dark">Start Free Trial</button>
                    <button class="btn btn-primary">Choose Plan</button>
                </div>
            </div>`
})
btnYear.addEventListener('click',()=>{
    btnYear.style.background = '#333'
    btnMonth.style.background = '#33333300'
    btnMonth.style.border = 'none'
    planGrid.innerHTML = `
            <div class="price-card">
                <h3>Basic Plan</h3>
                <p>Enjoy an extensive library of movies and shows, featuring a range of content, including recently released titles.</p>
                <div class="price">$99.99 <span>/year</span></div>
                <div class="price-actions">
                    <button class="btn btn-dark">Start Free Trial</button>
                    <button class="btn btn-primary">Choose Plan</button>
                </div>
            </div>
            <div class="price-card">
                <h3>Standard Plan</h3>
                <p>Access to a wider selection of movies and shows, including most new releases and exclusive content.</p>
                <div class="price">$129.99 <span>/year</span></div>
                <div class="price-actions">
                    <button class="btn btn-dark">Start Free Trial</button>
                    <button class="btn btn-primary">Choose Plan</button>
                </div>
            </div>
            <div class="price-card">
                <h3>Premium Plan</h3>
                <p>Access to a widest selection of movies and shows, including all new releases and Offline Viewing.</p>
                <div class="price">$149.99 <span>/year</span></div>
                <div class="price-actions">
                    <button class="btn btn-dark">Start Free Trial</button>
                    <button class="btn btn-primary">Choose Plan</button>
                </div>
            </div>`
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
