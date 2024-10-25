import fs from 'fs'
import { templateRenderer } from '../../../utils/__testutils/templateTestUtils'

describe('outcome banner', () => {
  const render = templateRenderer(fs.readFileSync('server/views/partials/initialChecks/outcomeBanner.njk').toString())

  it('should render banner when eligible', () => {
    const $ = render({
      assessmentSummary: {
        forename: 'Bob',
        surname: 'Smith',
      },
      criteria: {
        overallStatus: 'ELIGIBLE',
      },
    })

    expect($('[data-qa="bannerHeading"]').text()).toContain('Bob Smith is eligible for HDC')
  })

  it('should render banner when ineligible', () => {
    const $ = render({
      assessmentSummary: {
        forename: 'Bob',
        surname: 'Smith',
      },
      criteria: {
        overallStatus: 'INELIGIBLE',
      },
    })

    expect($('[data-qa="bannerHeading"]').text()).toContain('Bob Smith is ineligible for HDC')
  })

  it('wont render banner when not started', () => {
    const $ = render({
      assessmentSummary: {
        forename: 'Bob',
        surname: 'Smith',
      },
      criteria: {
        overallStatus: 'NOT_STARTED',
      },
    })

    expect($('[data-qa="bannerHeading"]').length).toStrictEqual(0)
  })
})
