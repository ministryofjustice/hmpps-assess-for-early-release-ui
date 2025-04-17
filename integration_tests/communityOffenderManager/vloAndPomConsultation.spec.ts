import { expect, test } from '@playwright/test'
import { assessmentSummary, createOffenderSummary } from '../mockApis/assessForEarlyReleaseData'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'

import { login, resetStubs } from '../testUtils'
import paths from '../../server/routes/paths'
import { createStaffDetails } from '../../server/data/__testutils/testObjects'
import AssessmentStatus from '../../server/enumeration/assessmentStatus'
import playwrightConfig from '../../playwright.config'

test.describe('VLO and POM consultation task', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can update the VLO and POM consultation information ', async ({ page }) => {
    const prisonNumber = 'A1234AE'
    const staffCode = 'STAFF1'

    await assessForEarlyRelease.stubDeliusStaff('USER1', createStaffDetails({ code: staffCode }))
    await assessForEarlyRelease.stubGetComCaseload(staffCode, [
      createOffenderSummary({
        prisonNumber,
        status: AssessmentStatus.ADDRESS_AND_RISK_CHECKS_IN_PROGRESS,
      }),
    ])
    await assessForEarlyRelease.stubGetAssessmentSummary(
      assessmentSummary(prisonNumber, AssessmentStatus.AWAITING_ADDRESS_AND_RISK_CHECKS, 'CONSULT_THE_VLO_AND_POM'),
    )
    await assessForEarlyRelease.stubSaveVloAndPomInfo(prisonNumber)

    await login(page, { authorities: ['ROLE_LICENCE_RO'], authSource: 'delius' })
    await page.goto(paths.probation.probationCaseload({}))
    await page.getByRole('link', { name: 'Jim Smith' }).click()

    const initialTask = page.getByTestId('CONSULT_THE_VLO_AND_POM')
    await expect(initialTask).toBeVisible()
    await expect(initialTask.getByText('Consult the VLO and POM')).toContainText('Ready to start')

    await page.locator('[data-qa="CONSULT_THE_VLO_AND_POM"] .govuk-button').click()

    await expect(
      page.getByText('Does this case qualify for the Victim Contact Scheme and has the victim opted in?'),
    ).toBeVisible()
    await page.getByLabel('Yes').click()
    await expect(
      page.getByText(
        'Enter details of any requests the victim has made. For example, whether exclusion zones have been requested.',
      ),
    ).toBeVisible()
    await page.getByTestId('victimContactSchemeRequests').fill('request')
    await page.getByTestId('pomBehaviourInformation').fill('POM information')
    await page.getByTestId('save').click()
    await expect(page).toHaveURL(`${playwrightConfig.use.baseURL}${paths.probation.assessment.home({ prisonNumber })}`)
  })
})
