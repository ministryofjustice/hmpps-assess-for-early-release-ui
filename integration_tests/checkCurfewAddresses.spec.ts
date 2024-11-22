import { expect, test } from '@playwright/test'
import assessForEarlyRelease from './mockApis/assessForEarlyRelease'
import { assessmentSummary, createCheckRequestsForAssessmentSummary } from './mockApis/assessForEarlyReleaseData'

import { login, resetStubs } from './testUtils'
import paths from '../server/routes/paths'

test.describe('Can check curfew addresses', () => {
  test.afterEach(async () => {
    await resetStubs()
  })
  test('A COM can view curfew addresses linked to an assessment and start checks', async ({ page }) => {
    const prisonNumber = 'A1234AE'
    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummary(prisonNumber))
    await assessForEarlyRelease.stubGetCheckRequestsForAssessment(prisonNumber, createCheckRequestsForAssessmentSummary)

    await login(page, { authorities: ['ROLE_LICENCE_RO'] })

    await page.goto(paths.probation.assessment.curfewAddress.checkCurfewAddresses({ prisonNumber }))

    await expect(page.getByText('Proposed curfew addresses')).toBeVisible()
    await expect(page.getByText('Preferred address')).toBeVisible()
    await expect(page.getByText('Second address')).toBeVisible()
    await expect(page.getByTestId('return-to-application-overview')).toBeVisible()

    const startChecksButtons = page.getByTestId('address-start-checks')
    await expect(startChecksButtons).toHaveCount(2)
    await expect(startChecksButtons).toHaveText(['Start checks', 'Start checks'])
  })
})
