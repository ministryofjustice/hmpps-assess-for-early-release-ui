import { expect, test } from '@playwright/test'
import { assessmentSummary, createCheckRequestsForAssessmentSummary } from '../mockApis/assessForEarlyReleaseData'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'

import { login, resetStubs } from '../testUtils'
import paths from '../../server/routes/paths'
import playwrightConfig from '../../playwright.config'

test.describe('Can edit, add & remove curfew address', () => {
  const prisonNumber = 'A1234AE'

  test.beforeEach(async () => {
    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummary(prisonNumber))
  })

  test.afterEach(async () => {
    await resetStubs()
  })
  test('Should display continue button and option to add another address', async ({ page }) => {
    await assessForEarlyRelease.stubGetCheckRequestsForAssessment(prisonNumber, [
      createCheckRequestsForAssessmentSummary[0],
    ])
    await login(page, { authorities: ['ROLE_LICENCE_CA'] })
    await page.goto(paths.prison.assessment.enterCurfewAddressOrCasArea.requestMoreAddressChecks({ prisonNumber }))
    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.prison.assessment.enterCurfewAddressOrCasArea.requestMoreAddressChecks({ prisonNumber })}`,
    )

    await expect(page.getByText('Do you need to add another curfew address?')).toBeVisible()
    await expect(page.getByTestId('continue')).toBeVisible()
    await expect(page.getByTestId('checkYourAnswers')).not.toBeVisible()
  })

  test('Should display check your answers button if there are two curfew addresses', async ({ page }) => {
    await assessForEarlyRelease.stubGetCheckRequestsForAssessment(prisonNumber, createCheckRequestsForAssessmentSummary)
    await login(page, { authorities: ['ROLE_LICENCE_CA'] })
    await page.goto(paths.prison.assessment.enterCurfewAddressOrCasArea.requestMoreAddressChecks({ prisonNumber }))
    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.prison.assessment.enterCurfewAddressOrCasArea.requestMoreAddressChecks({ prisonNumber })}`,
    )

    await expect(page.getByText('Preferred address:')).toBeVisible()
    await expect(page.getByText('Second address:')).toBeVisible()

    await expect(page.getByTestId('continue')).not.toBeVisible()
    await expect(page.getByTestId('checkYourAnswers')).toBeVisible()
  })
})
