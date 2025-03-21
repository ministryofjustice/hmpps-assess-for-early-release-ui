import { expect, test } from '@playwright/test'
import { assessmentSummary, createCheckRequestsForAssessmentSummary } from '../mockApis/assessForEarlyReleaseData'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'

import { login, resetStubs } from '../testUtils'
import paths from '../../server/routes/paths'
import playwrightConfig from '../../playwright.config'

test.describe('Can add more information for address checks', () => {
  const prisonNumber = 'A1234AE'
  const checkRequestId = createCheckRequestsForAssessmentSummary[0].requestId

  test.beforeEach(async ({ page }) => {
    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummary(prisonNumber))
    await assessForEarlyRelease.stubGetCheckRequestsForAssessment(prisonNumber, [
      createCheckRequestsForAssessmentSummary[0],
    ])
    await assessForEarlyRelease.stubGetUpdateCaseAdminAdditionalInformation(prisonNumber, checkRequestId)
    await login(page, { authorities: ['ROLE_LICENCE_CA'] })
    await page.goto(
      paths.prison.assessment.enterCurfewAddressOrCasArea.moreInformationRequiredCheck({
        prisonNumber,
        checkRequestId,
      }),
    )
    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.prison.assessment.enterCurfewAddressOrCasArea.moreInformationRequiredCheck({ prisonNumber, checkRequestId })}`,
    )
    await expect(page.getByRole('heading', { name: 'Do you need to enter any more' })).toBeVisible()
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Should display add more info text box, if user selects option yes', async ({ page }) => {
    await page.getByLabel('Yes').click()
    await expect(page.getByLabel('Add more information')).toBeVisible()
    await page.getByLabel('Add more information').fill('more info')
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.prison.assessment.enterCurfewAddressOrCasArea.requestMoreAddressChecks({ prisonNumber })}`,
    )
  })

  test('Should throw validation error if user clicks on continue with out adding more info', async ({ page }) => {
    await page.getByLabel('Yes').click()
    await expect(page.getByLabel('Add more information')).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page.getByRole('link', { name: 'Please enter information' })).toBeVisible()
    await expect(page.getByText('Error: Please enter')).toBeVisible()

    await expect(page).not.toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.prison.assessment.enterCurfewAddressOrCasArea.requestMoreAddressChecks({ prisonNumber })}`,
    )
  })

  test('Should not display add more info text box, if user selects option no', async ({ page }) => {
    await page.getByLabel('No').click()
    await expect(page.getByLabel('Add more information')).not.toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.prison.assessment.enterCurfewAddressOrCasArea.requestMoreAddressChecks({ prisonNumber })}`,
    )
  })
})
