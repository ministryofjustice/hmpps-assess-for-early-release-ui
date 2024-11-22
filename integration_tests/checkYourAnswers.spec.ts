import { expect, test } from '@playwright/test'
import { assessmentSummary, createCheckRequestsForAssessmentSummary } from './mockApis/assessForEarlyReleaseData'
import assessForEarlyRelease from './mockApis/assessForEarlyRelease'

import { login, resetStubs } from './testUtils'
import paths from '../server/routes/paths'
import playwrightConfig from '../playwright.config'

test.describe('Can change, remove & save assessments', () => {
  test.afterEach(async () => {
    await resetStubs()
  })
  test('Should display assessment summary', async ({ page }) => {
    const prisonNumber = 'A1234AE'

    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummary(prisonNumber))
    await assessForEarlyRelease.stubGetCheckRequestsForAssessment(prisonNumber, createCheckRequestsForAssessmentSummary)

    await login(page, { authorities: ['ROLE_LICENCE_CA'] })

    await page.goto(paths.prison.assessment.curfewAddress.checkYourAnswers({ prisonNumber }))

    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.prison.assessment.curfewAddress.checkYourAnswers({ prisonNumber })}`,
    )

    await expect(page.getByText('Check your answers')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Preferred address' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Second address' })).toBeVisible()
    await expect(page.getByTestId('preferred-address-residential-details')).toBeVisible()
    await expect(page.getByTestId('second-address-residential-details')).toBeVisible()

    await expect(page.getByTestId('save')).toBeVisible()
  })

  test('Should not display second address details', async ({ page }) => {
    const prisonNumber = 'A1234AE'

    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummary(prisonNumber))
    await assessForEarlyRelease.stubGetCheckRequestsForAssessment(prisonNumber, [
      createCheckRequestsForAssessmentSummary[0],
    ])

    await login(page, { authorities: ['ROLE_LICENCE_CA'] })

    await page.goto(paths.prison.assessment.curfewAddress.checkYourAnswers({ prisonNumber }))

    await expect(page.getByRole('heading', { name: 'Preferred address' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Second address' })).not.toBeVisible()
    await expect(page.getByTestId('preferred-address-residential-details')).toBeVisible()
    await expect(page.getByText('second-address-residential-details')).not.toBeVisible()

    const removeLink = await page.getByRole('link', { name: 'Remove preferred address' }).getAttribute('href')
    expect(removeLink).toContain(
      paths.prison.assessment.curfewAddress.deleteCheckYourAnswers({ prisonNumber, checkRequestId: '1' }),
    )

    const chnageLink = await page.getByRole('link', { name: 'Change  change preferred' }).getAttribute('href')
    expect(chnageLink).toContain(
      paths.prison.assessment.curfewAddress.addResidentDetails({ prisonNumber, checkRequestId: '1' }),
    )

    await expect(page.getByTestId('save')).toBeVisible()
  })
})
