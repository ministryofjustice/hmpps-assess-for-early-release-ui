document.addEventListener('DOMContentLoaded', () => {
  const pageIdentifier = document.querySelector('[data-page-id="add-resident-details"]')
  if (!pageIdentifier) {
    return
  }

  const isOffenderMainOccupierCheckbox = document.getElementById('isOffender')
  const mainOccupierElement = document.getElementById('mainOccupier')

  function handleCheckboxChange() {
    if (isOffenderMainOccupierCheckbox.checked) {
      mainOccupierElement.style.display = 'none'
    } else {
      mainOccupierElement.style.display = 'block'
    }
  }

  if (isOffenderMainOccupierCheckbox && mainOccupierElement) {
    // Listen for the change event
    isOffenderMainOccupierCheckbox.addEventListener('change', handleCheckboxChange)

    // Call the handler on page load
    handleCheckboxChange()
  }
})
