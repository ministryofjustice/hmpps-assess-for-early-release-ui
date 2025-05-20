import { expect, test } from '@playwright/test'
import { assessmentSummary, createCheckRequestsForAssessmentSummary } from '../mockApis/assessForEarlyReleaseData'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'

import { login, resetStubs } from '../testUtils'
import paths from '../../server/routes/paths'
import playwrightConfig from '../../playwright.config'

test.describe('Add reason to delete address', () => {
  const prisonNumber = 'A1234AE'
  const checkRequestId = createCheckRequestsForAssessmentSummary[0].requestId

  test.afterEach(async () => {
    await resetStubs()
  })

  test.beforeEach(async ({ page }) => {
    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummary(prisonNumber))

    await login(page, { authorities: ['ROLE_LICENCE_CA'] })
    await page.goto(
      paths.prison.assessment.addressDeleteReason({
        prisonNumber,
        checkRequestId,
      }),
    )
    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.prison.assessment.addressDeleteReason({ prisonNumber, checkRequestId })}`,
    )
    await expect(page.getByText('Provide a reason for deleting')).toBeVisible()
  })

  test('Should throw error if no option is selected', async ({ page }) => {
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page.getByRole('link', { name: 'Provide a reason for deleting' })).toBeVisible()

    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.prison.assessment.addressDeleteReason({ prisonNumber, checkRequestId })}`,
    )
  })

  test('Should throw validation error if user clicks on continue without adding other reason when selecting other reason option', async ({
    page,
  }) => {
    await page.getByText('Other reason').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.getByRole('link', { name: 'Other reason cannot be blank' })).toBeVisible()

    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.prison.assessment.addressDeleteReason({ prisonNumber, checkRequestId })}`,
    )
  })

  test('Should navigate to assessment home page after selecting proper option to delete address', async ({ page }) => {
    await page.getByText('Probation practitioner does not have time to assess').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page).not.toHaveURL(`${playwrightConfig.use.baseURL}${paths.prison.assessment.home({ prisonNumber })}`)
  })
})
