const pages = ['home', 'support-home']

document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body')
  const pageType = body.getAttribute('data-page')
  if (pages.includes(pageType)) {
    initCards()
  }
})

const initCards = () => {
  // Loops through dom and finds all elements with card--clickable class
  document.querySelectorAll('.card--clickable').forEach(card => {
    // Check if card has a link within it
    if (card.querySelector('a') !== null) {
      // Clicks the link within the heading to navigate to desired page
      card.addEventListener('click', () => {
        card.querySelector('a').click()
      })
    }
  })
}
