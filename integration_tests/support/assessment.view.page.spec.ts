import { expect, Locator, Page, test } from '@playwright/test'
import { login, resetStubs } from '../testUtils'
import paths from '../../server/routes/paths'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'
import { createStaffDetails } from '../../server/data/__testutils/testObjects'
import {
  createAssessmentResponse,
  createAssessmentSearchResponse,
  createOffenderResponse,
  createOffenderSearchResponse,
} from '../mockApis/assessForEarlyReleaseData'

test.describe('Offender assessment overview page', () => {
  const staffCode = 'STAFF1'
  const prisonNumber = 'A1234AE'

  test.beforeEach(async () => {
    await assessForEarlyRelease.stubDeliusStaff('USER1', createStaffDetails({ code: staffCode }))
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('View connected assessment', async ({ page }) => {
    // Given
    await loginSupportUser(page)

    await page.goto(paths.support.offender.supportOffenderSearch({}))
    await page.getByTestId('searchStringInput').click()
    await page.keyboard.type(prisonNumber)

    const searchResult1 = createOffenderSearchResponse({ prisonNumber })
    await assessForEarlyRelease.stubGetOffenderSearch(prisonNumber, [searchResult1])

    await page.getByTestId('searchOffender').click()

    const offender = createOffenderResponse({ prisonNumber })
    await assessForEarlyRelease.stubGetOffenderResponse(prisonNumber, offender)

    await assessForEarlyRelease.stubGetAssessmentSearchResponse(prisonNumber, [createAssessmentSearchResponse()])
    await assessForEarlyRelease.stubGetCurrentAssessmentResponse(prisonNumber, createAssessmentResponse())
    await page.locator('#name-button-1').click()

    await assessForEarlyRelease.stubGetAssessmentResponse('722', createAssessmentResponse())

    // When
    await page.locator('#view-button-1').click()

    // Then
    expect(await page.getByRole('link', { name: 'Back', exact: true }).getAttribute('href')).toEqual('#')
    await expect(page.getByText(`Assessment for Prison Number: A1234AE`)).toBeVisible()
    const rows = page.locator('.govuk-summary-list__row')

    await assertKeyValue(rows, 0, `Booking Id`, `773722`)
    await assertKeyValue(rows, 1, `Sentence Start Date`, `23/06/28`)
    await assertKeyValue(rows, 2, `HDCED`, `23/08/26`)
    await assertKeyValue(rows, 3, `CRD`, `23/09/26`)
    await assertKeyValue(rows, 4, `Status`, `NOT_STARTED`)
    await assertKeyValue(rows, 5, `Policy Version`, `1`)
    await assertKeyValue(rows, 6, `Address Checks Complete`, `true`)
    await assertKeyValue(rows, 7, `Team`, `MyTeam`)
    await assertKeyValue(rows, 8, `Postponement Date`, `23/08/26`)
    await assertKeyValue(rows, 9, `OptOut Reason`, `NOWHERE_TO_STAY`)
    await assertKeyValue(rows, 10, `OptOut Reason Other`, `another reason`)
    await assertKeyValue(rows, 11, `Assigned community officer`, `true`)

    // Staff details
    await assertKeyValue(rows, 12, `Name`, `Testforename Testsurname`)
    await assertKeyValue(rows, 13, `Staff Code`, `STAFF1`)
    await assertKeyValue(rows, 14, `User Name`, `testName`)
    await assertKeyValue(rows, 15, `Email`, `test.com@moj.com`)

    // Audit details
    await assertKeyValue(rows, 16, `Created`, `10/01/20 12:13`)
    await assertKeyValue(rows, 17, `Last Updated`, `11/01/20 12:13`)
    await assertKeyValue(rows, 18, `Deleted`, `12/01/20 12:13`)
  })

  async function assertKeyValue(rows: Locator, index: number, key: string, value: string) {
    const row = rows.nth(index)
    const keyItem = row.getByText(key, { exact: true })
    await expect(keyItem).toBeVisible()
    const valueItem = row.getByText(value, { exact: true })
    await expect(valueItem).toBeVisible()
  }

  async function loginSupportUser(page: Page) {
    await login(page, { authorities: ['ROLE_NOMIS_BATCHLOAD', 'ROLE_LICENCE_CA'] })
  }
})
