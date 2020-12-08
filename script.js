const quoteContainer = document.getElementById('quote-container')
const quoteText = document.getElementById('quote')
const authorText = document.getElementById('author')
const twitterBtn = document.getElementById('twitter')
const newQuoteBtn = document.getElementById('new-quote')
const loader = document.getElementById('loader')
let tryCounter = 0

// Loading Spinner Shown
function showLoadingSpinner () {
  loader.hidden = false
  quoteContainer.hidden = true
}

// Remove Loading Spinner
function removeLoadingSpinner () {
  if (!loader.hidden) {
    quoteContainer.hidden = false
    loader.hidden = true
  }
}

async function getQuoteFromApi () {
  tryCounter = 0
  showLoadingSpinner()
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
  const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json'

  try {
    const response = await fetch(proxyUrl + apiUrl)
    const data = await response.json()

    // If Author is blank, add 'Unknown'
    if (data.quoteAuthor === '') {
      authorText.innerText = 'Unknown'
    } else {
      authorText.innerText = data.quoteAuthor
    }

    // Reduce font-size for long quotes
    if (data.quoteText.length > 120) {
      quoteText.classList.add('long-quote')
    } else {
      quoteText.classList.remove('long-quote')
    }
    quoteText.innerText = data.quoteText
    removeLoadingSpinner()
  } catch (error) {
    tryCounter++
    if (tryCounter >= 10) {
      getQuoteFromApi()
    } else {
      console.log('Sorry, this API seems to be down right now. Please try again later.')
    }
  }
}

// Tweet quote
function tweetQuote () {
  const quote = quoteText.innerText
  const author = authorText.innerText
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} – ${author}`
  window.open(twitterUrl, '_blank')
}

// Event Listeners
newQuoteBtn.addEventListener('click', getQuoteFromApi)
twitterBtn.addEventListener('click', tweetQuote)

// On Load
getQuoteFromApi()
