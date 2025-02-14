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

test.describe('Can perform address checks', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can check if a curfew address is suitable ', async ({ page }) => {
    const prisonNumber = 'A1234AE'
    const staffCode = 'STAFF1'
    const addressCheckRequestId = 1

    await assessForEarlyRelease.stubDeliusStaff('USER1', createStaffDetails({ code: staffCode }))
    await assessForEarlyRelease.stubGetComCaseload(staffCode, [
      createOffenderSummary({
        prisonNumber,
      }),
    ])
    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummary(prisonNumber))
    await assessForEarlyRelease.stubGetCheckRequestsForAssessment(prisonNumber, createCheckRequestsForAssessmentSummary)
    await assessForEarlyRelease.stubGetStandardAddressCheckRequest(prisonNumber, addressCheckRequestId)
    await assessForEarlyRelease.stubGetResidentialChecksView(prisonNumber, addressCheckRequestId)
    await assessForEarlyRelease.stubGetResidentialChecksTask(prisonNumber, addressCheckRequestId)

    await login(page, { authorities: ['ROLE_LICENCE_RO'], authSource: 'delius' })

    await page.goto(paths.probation.probationCaseload({}))

    await page.getByRole('link', { name: 'Jim Smith' }).click()

    const initialTask = page.getByTestId('CHECK_ADDRESSES_OR_COMMUNITY_ACCOMMODATION')
    await expect(initialTask).toBeVisible()
    await expect(initialTask.getByText('Check addresses or community accommodation')).toContainText('Ready to start')

    await page.locator('[data-qa="CHECK_ADDRESSES_OR_COMMUNITY_ACCOMMODATION"] .govuk-button').click()

    await expect(page.getByText('Proposed curfew addresses')).toBeVisible()
    await expect(page.getByText('Preferred address')).toBeVisible()
    await expect(page.getByText('Second address')).toBeVisible()
    await expect(page.getByTestId('return-to-application-overview')).toBeVisible()

    const startChecksButtons = page.getByTestId('address-start-checks')
    await expect(startChecksButtons).toHaveCount(2)
    await expect(startChecksButtons).toHaveText(['Start checks', 'Start checks'])

    await startChecksButtons.nth(0).click()
    await expect(page.getByText('Check if a curfew address is suitable')).toBeVisible()
    const tasks = page.locator('[data-qa="residential-checks-task-list"] .govuk-task-list__link')
    await expect(tasks).toHaveCount(6)

    await page
      .locator('[data-qa="residential-checks-task-list"] a[href*="address-details-and-informed-consent"]')
      .click()
    await expect(page.getByText('Address details and informed consent')).toBeVisible()
    await expect(page.getByText('Is the address connected to an electricity supply')).toBeVisible()
    await expect(page.getByText('They must understand')).toBeVisible()
  })
})
