document.addEventListener('DOMContentLoaded', () => {
  const isOffenderMainOccupierCheckbox = document.getElementById('isOffender')

  if (isOffenderMainOccupierCheckbox) {
    // Listen for the change event
    isOffenderMainOccupierCheckbox.addEventListener('change', handleIsOffenderMainOccupierChange)

    // Call the handler on page load
    handleIsOffenderMainOccupierChange()
  }

  window.mojFrontend.AddAnother.prototype.resetItem = item => {
    item.find('[data-name], [data-id]').each((index, el) => {
      const element = el
      if (element) {
        element.value = ''
      }
    })
    item.find('.govuk-error-message').remove()
    const classesToReset = ['govuk-form-group--error', 'govuk-input--error', 'govuk-textarea--error']
    classesToReset.forEach(c => {
      item.find(`.${c}`).removeClass(c)
    })
  }

  window.mojFrontend.AddAnother.prototype.createRemoveButton = item => {
    item.append(
      '<button type="button" class="govuk-button govuk-button--secondary moj-add-another__remove-button remove-button">Remove</button>',
    )
  }
})

function handleIsOffenderMainOccupierChange() {
  const isOffenderMainOccupierCheckbox = document.getElementById('isOffender')
  const mainOccupierElement = document.getElementById('mainOccupier')

  if (isOffenderMainOccupierCheckbox && mainOccupierElement) {
    if (isOffenderMainOccupierCheckbox.checked) {
      mainOccupierElement.style.display = 'none'
    } else {
      mainOccupierElement.style.display = 'block'
    }
  }
}
