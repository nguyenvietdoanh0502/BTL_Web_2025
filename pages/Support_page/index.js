document.querySelectorAll('.faq-item').forEach(item => {
    const header = item.querySelector('.faq-header');
    header.addEventListener('click', () => {
        const icon = item.querySelector('.toggle-icon');
        item.classList.toggle('expanded');
        if (item.classList.contains('expanded')) {
            icon.classList.remove('fa-plus');
            icon.classList.add('fa-minus');
        } else {
            icon.classList.remove('fa-minus');
            icon.classList.add('fa-plus');
        }
    });
});
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

const countrySelect = document.querySelector('#country-select')
const countryDropdown = document.querySelector('#country-dropdown')
const currentFlag = document.querySelector('#current-flag')
const listItems = countryDropdown.querySelectorAll('li')
countrySelect.addEventListener('click',(e)=>{
    e.stopPropagation();
    countryDropdown.classList.toggle('active')
})
listItems.forEach(item=>{
    item.addEventListener('click',(e)=>{
        e.stopPropagation();
        const newFlag = item.getAttribute('data-flag')
        currentFlag.src = newFlag
        countryDropdown.classList.remove('active')
    })
})
document.addEventListener('click',(e)=>{
    if(!countrySelect.contains(e.target)){
        countryDropdown.classList.remove('active')
    }
})

const fname = document.querySelector('#fname')
const lname = document.querySelector('#lname')
const email = document.querySelector('#email')
const phone = document.querySelector('#phone')
const mes = document.querySelector('#message')
const btnSend = document.querySelector('#send')
const allPhone = document.querySelector('#phone-input-wrapper')
const terms = document.querySelector('#terms')
btnSend.addEventListener('click',()=>{
    if(fname.value==''){
        fname.style.border = '1px solid var(--primary-red)'
        fname.style.background = '#ff000d54'
        setTimeout(()=>{
            fname.style.border = '1px solid var(--border-color)'
            fname.style.background = 'var(--bg-dark-gray)'
        },1000)
    }
    if(lname.value==''){
        lname.style.border = '1px solid var(--primary-red)'
        lname.style.background = '#ff000d54'
        setTimeout(()=>{
            lname.style.border = '1px solid var(--border-color)'
            lname.style.background = 'var(--bg-dark-gray)'
        },1000)
    }
    if(email.value==''){
        email.style.border = '1px solid var(--primary-red)'
        email.style.background = '#ff000d54'
        setTimeout(()=>{
            email.style.border = '1px solid var(--border-color)'
            email.style.background = 'var(--bg-dark-gray)'
        },1000)
    }
    if(phone.value==''){
        allPhone.style.border = '1px solid var(--primary-red)'
        allPhone.style.background = '#ff000d54'
        setTimeout(()=>{
            allPhone.style.border = '1px solid var(--border-color)'
            allPhone.style.background = 'var(--bg-dark-gray)'
        },1000)
    }
    if(mes.value==''){
        mes.style.border = '1px solid var(--primary-red)'
        mes.style.background = '#ff000d54'
        setTimeout(()=>{
            mes.style.border = '1px solid var(--border-color)'
            mes.style.background = 'var(--bg-dark-gray)'
        },1000)
    }
    
})
function goWatchPage(slug){
    window.location.href = `../Watch_movie_page/index.html?slug=${slug}`
}