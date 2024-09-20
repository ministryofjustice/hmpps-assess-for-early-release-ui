import { expect, test } from '@playwright/test'
import { resetStubs } from './mockApis/wiremock'
import assessForEarlyRelease from './mockApis/assessForEarlyRelease'
import { getSignInUrl } from './mockApis/auth'
import { login, stubFeComponents } from './testUtils'
import AssessmentStatus from '../server/enumeration/assessmentStatus'

// TODO : move paths to common file
test.describe('Opt out', () => {
  test.afterEach(async () => {
    await resetStubs()
  })
  test('Offender can opt out of HDC', async ({ page }) => {
    const prisonNumber = 'A1234AE'

    await stubFeComponents()
    await assessForEarlyRelease.stubGetAssessmentSummary(prisonNumber)
    await assessForEarlyRelease.stubOptOut(prisonNumber)

    await login({ authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'] })

    await page.goto('/')
    const url = await getSignInUrl()
    await page.goto(url)

    await page.goto(`/prison/assessment/${prisonNumber}`)
    const optInOutLink = await page.getByTestId('optInOutAction').getAttribute('href')
    expect(optInOutLink).toEqual(`/prison/assessment/${prisonNumber}/opt-out-check`)

    await page.goto(optInOutLink)
    await page.getByTestId('theyWantToOptOutRadio').click()
    await page.getByTestId('continue').click()

    await assessForEarlyRelease.stubGetAssessmentSummary(prisonNumber, AssessmentStatus.OPTED_OUT)
    await page.getByTestId('doNotWantToBeTaggedRadio').click()
    await page.getByTestId('continue').click()

    await expect(page.getByTestId('optedOutOfHdcBanner')).toHaveText('Jimmy Quelch has opted out of HDC')
  })
})
