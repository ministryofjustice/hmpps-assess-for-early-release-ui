import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import './card'
import './addAnother'

govukFrontend.initAll()
mojFrontend.initAll()

window.mojFrontend = mojFrontend

// Initiate the back links
$('[class$=js-backlink]').on('click', e => {
  e.preventDefault()
  if ($('ul.govuk-error-summary__list').length > 0) {
    window.history.go(-2)
  } else {
    window.history.go(-1)
  }
})
