document.addEventListener('DOMContentLoaded', () => {
  const isOffenderMainOccupierCheckbox = document.getElementById('isOffenderMainOccupier')
  const offenderIsNotMainOccupierElement = document.getElementById('offenderIsNotMainOccupier')

  isOffenderMainOccupierCheckbox.addEventListener('change', () => {
    if (isOffenderMainOccupierCheckbox.checked) {
      offenderIsNotMainOccupierElement.style.display = 'none'
    } else {
      offenderIsNotMainOccupierElement.style.display = 'block'
    }
  })

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
