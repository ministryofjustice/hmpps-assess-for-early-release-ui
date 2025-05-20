import { expect, test } from '@playwright/test'
import {
  assessmentSummary,
  createCheckRequestsForAssessmentSummary,
  createOffenderSummary,
} from '../mockApis/assessForEarlyReleaseData'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'

import { login, resetStubs } from '../testUtils'
import paths from '../../server/routes/paths'
import { createStaffDetails } from '../../server/data/__testutils/testObjects'

test.describe('Can view a summary of addresses and residential check results', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can view the summary page', async ({ page }) => {
    const prisonNumber = 'A1234AE'
    const staffCode = 'STAFF1'
    const addressCheckRequestId = 1

    await assessForEarlyRelease.stubDeliusStaff('USER1', createStaffDetails({ code: staffCode }))
    await assessForEarlyRelease.stubGetComStaffCaseload(staffCode, [createOffenderSummary({ prisonNumber })])
    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummary(prisonNumber))
    await assessForEarlyRelease.stubGetCheckRequestsForAssessment(prisonNumber, createCheckRequestsForAssessmentSummary)
    await assessForEarlyRelease.stubGetResidentialChecksView(prisonNumber, addressCheckRequestId)

    await login(page, { authorities: ['ROLE_LICENCE_RO'], authSource: 'delius' })
    await page.goto(paths.probation.assessment.reviewInformation({ prisonNumber }))

    await expect(page.getByText('Review information and send checks to prison')).toBeVisible()
    await expect(page.getByText('1, TEST ROAD')).toBeVisible()
    await expect(page.getByText('Kola Anag-1')).toBeVisible()
    await expect(page.getByText('Kola Anag-2')).toBeVisible()

    const electricitySupplyQuestion = page.getByText('Is the address connected to an electricity supply?')
    await expect(electricitySupplyQuestion).toHaveCount(2)
    const visitedAddressAnswer = page.getByText('I have not visited the address but I have spoken to the main occupier')
    await expect(visitedAddressAnswer).toHaveCount(2)
  })
})
