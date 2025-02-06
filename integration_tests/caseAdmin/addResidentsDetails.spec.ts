import { expect, test } from '@playwright/test'
import { assessmentSummary } from '../mockApis/assessForEarlyReleaseData'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'

import { login, resetStubs } from '../testUtils'
import paths from '../../server/routes/paths'
import playwrightConfig from '../../playwright.config'

test.describe('Can add, edit & remove residents', () => {
  test.afterEach(async () => {
    await resetStubs()
  })
  test('Should display main residents', async ({ page }) => {
    const prisonNumber = 'A1234AE'
    const checkRequestId = '1'

    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummary(prisonNumber))
    await assessForEarlyRelease.stubGetStandardAddressCheckRequest(prisonNumber, Number(checkRequestId))

    await login(page, { authorities: ['ROLE_LICENCE_CA'] })

    await page.goto(
      paths.prison.assessment.enterCurfewAddressOrCasArea.addResidentDetails({ prisonNumber, checkRequestId }),
    )

    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.prison.assessment.enterCurfewAddressOrCasArea.addResidentDetails({ prisonNumber, checkRequestId })}`,
    )

    await expect(page.getByText('Main occupier')).toBeVisible()
    await expect(page.getByText('Other residents (optional)')).toBeVisible()

    await expect(page.getByTestId('add-another-resident')).toBeVisible()
    await expect(page.getByTestId('addResidentContinue')).toBeVisible()
  })

  test('Should display main and other residents', async ({ page }) => {
    const prisonNumber = 'A1234AE'
    const checkRequestId = '1'

    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummary(prisonNumber))
    await assessForEarlyRelease.stubGetStandardAddressCheckRequestWithResidents(prisonNumber, Number(checkRequestId))

    await login(page, { authorities: ['ROLE_LICENCE_CA'] })

    await page.goto(
      paths.prison.assessment.enterCurfewAddressOrCasArea.addResidentDetails({ prisonNumber, checkRequestId }),
    )

    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.prison.assessment.enterCurfewAddressOrCasArea.addResidentDetails({ prisonNumber, checkRequestId })}`,
    )

    await expect(page.getByText('Main occupier')).toBeVisible()

    await expect(page.getByTestId('add-another-resident')).toBeVisible()
    await expect(page.getByTestId('add-another-empty-resident')).not.toBeVisible()
    await expect(page.getByTestId('addResidentContinue')).toBeVisible()

    // Check that the remove button is visible
    await expect(page.getByTestId('removeOtherResident[0]')).toBeVisible()
    await expect(page.getByTestId('removeOtherResident[1]')).toBeVisible()

    await expect(page.getByTestId('addResidentContinue')).toBeVisible()

    await page.getByTestId('addResidentContinue').click()

    const errorSummaryList = page.locator('.govuk-error-summary__list li')
    const errorMessages = (await errorSummaryList.allTextContents()).map(message => message.trim())

    await expect(errorMessages).toContain('Enter the 2nd other resident’s relationship to Jimmy Quelch')
  })
})
