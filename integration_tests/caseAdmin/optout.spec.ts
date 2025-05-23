import { expect, test } from '@playwright/test'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'
import { assessmentSummary } from '../mockApis/assessForEarlyReleaseData'

import { login, resetStubs } from '../testUtils'
import AssessmentStatus from '../../server/enumeration/assessmentStatus'
import paths from '../../server/routes/paths'

test.describe('Opt out', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('User can download address check form from the opt out link', async ({ page }) => {
    const prisonNumber = 'A1234AE'
    await assessForEarlyRelease.stubGetAssessmentSummary(
      assessmentSummary(prisonNumber, AssessmentStatus.AWAITING_ADDRESS_AND_RISK_CHECKS),
    )
    await assessForEarlyRelease.stubGetAssessmentContacts(prisonNumber)
    await assessForEarlyRelease.stubOptOut(prisonNumber)
    await login(page, { authorities: ['ROLE_LICENCE_CA'] })

    await page.goto(paths.prison.assessment.home({ prisonNumber }))
    const optOutLink = await page.getByTestId('optOutAction').getAttribute('href')
    expect(optOutLink).toEqual(paths.prison.assessment.enterCurfewAddressOrCasArea.optOutCheck({ prisonNumber }))
    await page.goto(optOutLink)
    const addressFormLink = await page.getByTestId('addressFormLink').getAttribute('href')
    expect(addressFormLink).toEqual(`/offender/${prisonNumber}/document/OFFENDER_ADDRESS_CHECKS_FORM`)
  })

  test('Offender can opt out of HDC', async ({ page }) => {
    const prisonNumber = 'A1234AE'

    await assessForEarlyRelease.stubGetAssessmentSummary(
      assessmentSummary(prisonNumber, AssessmentStatus.ADDRESS_AND_RISK_CHECKS_IN_PROGRESS),
    )
    await assessForEarlyRelease.stubGetAssessmentContacts(prisonNumber)
    await assessForEarlyRelease.stubOptOut(prisonNumber)

    await login(page, { authorities: ['ROLE_LICENCE_CA'] })

    await page.goto(paths.prison.assessment.home({ prisonNumber }))
    const optOutLink = await page.getByTestId('optOutAction').getAttribute('href')
    expect(optOutLink).toEqual(paths.prison.assessment.enterCurfewAddressOrCasArea.optOutCheck({ prisonNumber }))

    await page.goto(optOutLink)
    await page.getByTestId('theyWantToOptOutRadio').click()
    await page.getByTestId('continue').click()

    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummary(prisonNumber, AssessmentStatus.OPTED_OUT))
    await page.getByTestId('doNotWantToBeTaggedRadio').click()
    await page.getByTestId('continue').click()

    await expect(page.getByTestId('optedOutOfHdcBanner')).toHaveText('Kurn Uvarek has opted out of HDC')
  })

  test('Offender can cancel opt out of HDC', async ({ page }) => {
    const prisonNumber = 'A1234AE'

    await assessForEarlyRelease.stubGetAssessmentSummary(
      assessmentSummary(prisonNumber, AssessmentStatus.ADDRESS_AND_RISK_CHECKS_IN_PROGRESS),
    )
    await assessForEarlyRelease.stubGetAssessmentContacts(prisonNumber)
    await assessForEarlyRelease.stubOptOut(prisonNumber)

    await login(page, { authorities: ['ROLE_LICENCE_CA'] })

    await page.goto(paths.prison.assessment.home({ prisonNumber }))
    const optOutLink = await page.getByTestId('optOutAction').getAttribute('href')
    expect(optOutLink).toEqual(paths.prison.assessment.enterCurfewAddressOrCasArea.optOutCheck({ prisonNumber }))
    await page.goto(optOutLink)
    await page.getByTestId('theyWantToOptOutRadio').click()
    await page.getByTestId('continue').click()

    await page.getByTestId('doNotWantToBeTaggedRadio').click()
    await page.getByTestId('cancel').click()

    await expect(page.locator('#main-content')).toContainText('Enter curfew address or CAS area')
  })

  test('Check validation', async ({ page }) => {
    const prisonNumber = 'A1234AE'

    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummary(prisonNumber, AssessmentStatus.APPROVED))
    await assessForEarlyRelease.stubGetAssessmentContacts(prisonNumber)

    await login(page, { authorities: ['ROLE_LICENCE_CA'] })

    await page.goto(paths.prison.assessment.home({ prisonNumber }))

    await page.getByTestId('optOutAction').click()

    await expect(page.getByRole('heading', { name: 'There is a problem' })).not.toBeVisible()
    await page.getByTestId('continue').click()
    await expect(page.getByRole('heading', { name: 'There is a problem' })).toBeVisible()

    // Check that the yes option is in focus when clicking the error link in the summary
    await page.getByRole('link', { name: 'Select a value' }).click()
    await expect(page.locator('*:focus')).toHaveValue('yes')
  })
})
