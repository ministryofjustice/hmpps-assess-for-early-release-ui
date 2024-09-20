import { expect, test } from '@playwright/test'
import tokenVerification from './mockApis/tokenVerification'
import { resetStubs } from './mockApis/wiremock'
import feComponent from './mockApis/feComponent'
import assessForEarlyRelease from './mockApis/assessForEarlyRelease'
import { favicon, getSignInUrl, signIn, signOut, token } from './mockApis/auth'

const baseUrl = 'http://localhost:3007'

async function login({ authorities }: { authorities: string[] }, active = true) {
  await Promise.all([
    favicon(),
    signIn(),
    signOut(),
    token({ authorities }),
    tokenVerification.stubVerifyToken(active),
    feComponent.stubFeComponentsFail(),
  ])
}

test.describe('Opt out', () => {
  test.afterEach(async () => {
    await resetStubs()
  })
  test('Offender can opt out of HDC', async ({ page }) => {
    const prisonNumber = 'A1234AE'

    await feComponent.stubFeComponents()
    await feComponent.stubFeComponentsJs()
    await feComponent.stubFeComponentsCss()
    await assessForEarlyRelease.stubGetAssessmentSummary(prisonNumber)
    await assessForEarlyRelease.stubOptOut(prisonNumber)

    await login({ authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'] })

    await page.goto(baseUrl)
    const url = await getSignInUrl()
    await page.goto(`${baseUrl}${url}`)

    await page.goto(`${baseUrl}/prison/assessment/${prisonNumber}`)
    const optInOutLink = await page.getByTestId('optInOutAction').getAttribute('href')
    expect(optInOutLink).toEqual(`/prison/assessment/${prisonNumber}/opt-out-check`)

    await page.goto(`${baseUrl}${optInOutLink}`)
    await page.getByTestId('theyWantToOptOutRadio').click()
    await page.getByTestId('continue').click()

    await page.getByTestId('doNotWantToBeTaggedRadio').click()
    await page.getByTestId('continue').click()

    await expect(page.getByTestId('optedOutOfHdcBanner')).toHaveText('Jimmy Quelch has opted out of HDC')
  })
})
