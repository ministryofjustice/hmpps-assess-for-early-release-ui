import { expect, Page, test } from '@playwright/test'
import { login, resetStubs } from '../testUtils'
import paths from '../../server/routes/paths'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'
import { createStaffDetails } from '../../server/data/__testutils/testObjects'
import { createOffenderSearchResponse } from '../mockApis/assessForEarlyReleaseData'

test.describe('Offender search page', () => {
  const staffCode = 'STAFF1'
  const prisonNumber = 'A1234AE'

  async function loginSupportUser(page: Page) {
    await login(page, { authorities: ['ROLE_NOMIS_BATCHLOAD', 'ROLE_LICENCE_CA'] })
  }

  test.beforeEach(async () => {
    await assessForEarlyRelease.stubDeliusStaff('USER1', createStaffDetails({ code: staffCode }))
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Support view offender search page displays', async ({ page }) => {
    // Given
    await loginSupportUser(page)

    // When
    await page.goto(paths.support.offender.supportOffenderSearch({}))

    // Then
    expect(await page.getByRole('link', { name: 'Back', exact: true }).getAttribute('href')).toEqual('/support')
    await expect(page.getByText(`Search for Offenders`)).toBeVisible()
    await expect(page.getByText(`Type an prison number or crn number`)).toBeVisible()
    await expect(page.getByTestId('searchOffender')).toBeVisible()
  })

  test('Support search offends', async ({ page }) => {
    // Given
    await loginSupportUser(page)

    await page.goto(paths.support.offender.supportOffenderSearch({ prisonNumber }))
    await page.getByTestId('searchStringInput').click()
    await page.keyboard.type(prisonNumber)

    const searchResult1 = createOffenderSearchResponse({ prisonNumber })
    const searchResult2 = createOffenderSearchResponse({
      prisonNumber: 'A1234AE',
      prisonId: 'CWL',
      forename: 'Ceri',
      surname: 'Evans',
      dateOfBirth: '2000-02-02',
      crn: 'Y123456',
    })

    await assessForEarlyRelease.stubGetOffenderSearch(prisonNumber, [searchResult1, searchResult2])

    // When
    await page.getByTestId('searchOffender').click()

    // Then
    expect(await page.getByRole('link', { name: 'Back', exact: true }).getAttribute('href')).toEqual('/support')
    await expect(page.getByText(`Search for Offenders`)).toBeVisible()
    await expect(page.getByText(`Type an prison number or crn number`)).toBeVisible()

    const name1 = page.locator('#name-1')
    const crn1 = page.locator('#crn-1')
    const prisonId1 = page.locator('#prisonId-1')
    const dateOfBirth1 = page.locator('#dateOfBirth-1')
    const row1Link = page.locator('#name-button-1')

    await expect(name1).toBeVisible()
    await expect(crn1).toBeVisible()
    await expect(prisonId1).toBeVisible()
    await expect(dateOfBirth1).toBeVisible()
    await expect(row1Link).toBeVisible()

    await expect(name1).toContainText('Jim Smith')
    await expect(name1).toContainText('Prison number: A1234AE')
    await expect(crn1).toHaveText('X123456')
    await expect(prisonId1).toHaveText('BRI')
    await expect(dateOfBirth1).toHaveText('08 Jan 2001')

    const name2 = page.locator('#name-2')
    const crn2 = page.locator('#crn-2')
    const prisonId2 = page.locator('#prisonId-2')
    const dateOfBirth2 = page.locator('#dateOfBirth-2')
    const row2Link = page.locator('#name-button-2')

    await expect(row2Link).toBeVisible()
    await expect(name2).toContainText('Ceri Evans')
    await expect(name2).toContainText('Prison number: A1234AE')
    await expect(crn2).toHaveText('Y123456')
    await expect(prisonId2).toHaveText('CWL')
    await expect(dateOfBirth2).toHaveText('02 Feb 2000')
  })
})
