const apiKey = '326dfbea011c54e9283ed9adf271f222'
const imgApi = 'https://image.tmdb.org/t/p/w1280'
const botao = document.querySelector('[botao]')
const query = document.querySelector('[texto]')
const titulo = document.querySelector('[titulo]')
const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`
const conteudo = document.querySelector('[conteudo]')

let page = 1
let isSearching = false

async function fetchData(url) {
    try {
        const res = await fetch(url)
        if (!res.ok) {
            throw new Error('Network response was not ok! :/')
        } else {
            return await res.json()
        }
    } catch (e) {
        return e
    }
}

async function fetchAndShowResult(url) {
    const res = await fetchData(url)
    if (res && res.results) {
        showResults(res.results)
    }
}

function cardMovie(movie) {
    const { poster_path, original_title, release_date, overview } = movie
    const imagePath = poster_path ? imgApi + poster_path : './img-01.jpeg'
    const truncatedTitle = original_title.length > 15 ? original_title.slice(0, 15) + "..." : original_title
    const formatDate = release_date || 'No release date'
    const cardTemplate = `
        <div class="column">
            <div class="card">
                <a class="card-media" href="${imagePath}" target="_blank"><img src="${imagePath}" alt="${original_title}" width="100%"></a>
                <div class="card-content">
                    <div class="card-header">
                        <div class="left-content">
                            <h3 class="title-movie">${truncatedTitle}</h3>
                            <span class="release-date">${formatDate}</span>
                        </div>
                        <div class="right-content">
                            <a href="${imagePath}" target="_blank" class="cover-button">See Cover</a>
                        </div>
                        </div>
                        <div class="info">
                            ${overview || 'No overview yet...'}
                        </div>
                </div>
            </div>
        </div>
        `
    return cardTemplate
}

function clearInput() {
    query.innerHTML = ''
}

function showResults(item) {
    const newContent = item.map(cardMovie).join('')
    conteudo.innerHTML = newContent || "<p>No results found.</p>"
}

async function loadMoreResults() {
    if(isSearching){
        return
    }
    page++
    const url = query.value ? `${searchUrl}${query.value}` : `https://api.themoviedb.org/3/discover/movie?sort_by_popularity.desc&api_key=${apiKey}&page=${page}`
    await fetchAndShowResult(url)
}

function endPage(){
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement
    if(scrollTop + clientHeight >= scrollHeight - 20) {
        loadMoreResults()
    }
} 

async function handleSearch(e) {
    e.preventDefault()
    const searchTerm = query.value.trim()
    if(searchTerm) {
        isSearching = true
        clearInput()
        const newurl = `${searchUrl}${searchTerm}&page=${page}`
        await fetchAndShowResult(newurl)
    }
}

botao.addEventListener('click', handleSearch)
window.addEventListener('scroll', endPage)
window.addEventListener('resize', endPage)
titulo.addEventListener('click', init)

async function init() {
    clearInput()
    const url = `https://api.themoviedb.org/3/discover/movie?sort_by_popularity.desc&api_key=${apiKey}&page=${1}`
    isSearching = false
    await fetchAndShowResult(url)
}

init()