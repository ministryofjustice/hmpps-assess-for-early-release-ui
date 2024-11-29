import { expect, test } from '@playwright/test'
import { assessmentSummary, createOffenderSummary } from '../mockApis/assessForEarlyReleaseData'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'

import { login, resetStubs } from '../testUtils'
import paths from '../../server/routes/paths'
import { createStaffDetails } from '../../server/data/__testutils/testObjects'

test.describe('Can perform address checks', () => {
  test.afterEach(async () => {
    await resetStubs()
  })
  test('Should display assessment summary', async ({ page }) => {
    const prisonNumber = 'A1234AE'
    const staffId = 2000

    await assessForEarlyRelease.stubDeliusStaff('USER1', createStaffDetails({ id: staffId }))
    await assessForEarlyRelease.stubGetComCaseload(2000, [createOffenderSummary(prisonNumber)])
    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummary(prisonNumber))

    await login(page, { authorities: ['ROLE_LICENCE_RO'], authSource: 'delius' })

    await page.goto(paths.probation.probationCaseload({}))

    await page.getByRole('link', { name: 'Jim Smith' }).click()

    const initialTask = page.getByTestId('CHECK_ADDRESSES_OR_COMMUNITY_ACCOMMODATION')
    await expect(initialTask).toBeVisible()
    await expect(initialTask.getByText('Check addresses or community accommodation')).toContainText('Ready to start')

    // etc...
  })
})
