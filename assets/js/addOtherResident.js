// import * as mojFrontend from '@ministryofjustice/frontend'

document.addEventListener('DOMContentLoaded', () => {
  const continueButton = document.getElementById('continueButton')
  const skipOtherResidentValidationInput = document.getElementById('skipOtherResidentValidation')
  const addAnotherResidentEmptyButton = document.getElementById('addAnotherResidentEmptyButton')
  const otherResidentsContainer = document.getElementById('otherResidentsContainer')
  const otherResidentsEmptyContainer = document.getElementById('otherResidentsEmptyContainer')
  const otherResidentsExists = document.getElementById('otherResidentsExists').value === 'true'
  const errorSummaryVisible = document.querySelector('.govuk-error-summary') !== null

  if (!otherResidentsExists) {
    otherResidentsContainer.style.display = 'none'
  } else {
    otherResidentsEmptyContainer.style.display = 'none'
  }

  if (errorSummaryVisible) {
    otherResidentsContainer.style.display = 'block'
    otherResidentsEmptyContainer.style.display = 'none'
  }

  addAnotherResidentEmptyButton.addEventListener('click', () => {
    otherResidentsEmptyContainer.style.display = 'none'
    otherResidentsContainer.style.display = 'block'
  })

  continueButton.addEventListener('click', () => {
    if (otherResidentsContainer.style.display === 'none') {
      skipOtherResidentValidationInput.value = 'true'
    } else {
      skipOtherResidentValidationInput.value = 'false'
    }
  })

  window.mojFrontend.AddAnother.prototype.createRemoveButton = item => {
    item.append(
      '<button type="button" class="govuk-button govuk-button--secondary moj-add-another__remove-button remove-button">Remove</button>',
    )
  }
})
