import { expect, test } from '@playwright/test'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'
import { assessmentSummary } from '../mockApis/assessForEarlyReleaseData'

import { login, resetStubs } from '../testUtils'
import AssessmentStatus from '../../server/enumeration/assessmentStatus'
import paths from '../../server/routes/paths'

test.describe('Opt in', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Offender can opt in to HDC', async ({ page }) => {
    const prisonNumber = 'A1234AE'

    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummary(prisonNumber, AssessmentStatus.OPTED_OUT))
    await assessForEarlyRelease.stubGetAssessmentContacts(prisonNumber)
    await assessForEarlyRelease.stubOptIn(prisonNumber)

    await login(page, { authorities: ['ROLE_LICENCE_CA'] })

    await page.goto(paths.prison.assessment.home({ prisonNumber }))
    const allApplicationsLink = await page.getByTestId('allApplicationsAction').getAttribute('href')
    expect(allApplicationsLink).toEqual(paths.prison.prisonCaseload({}))
    const optOutLink = await page.getByTestId('optInAction').getAttribute('href')
    expect(optOutLink).toEqual(paths.prison.assessment.enterCurfewAddressOrCasArea.optIn({ prisonNumber }))
  })
})
