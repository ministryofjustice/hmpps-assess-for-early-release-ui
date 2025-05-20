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
import AssessmentStatus from '../../server/enumeration/assessmentStatus'

test.describe('Offender assessment overview page', () => {
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

  test('View Offender assessment list', async ({ page }) => {
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

    const assessmentSearchResponse1 = createAssessmentSearchResponse({ deletedTimestamp: '2021-01-11T12:13:00' })
    const assessmentSearchResponse2 = createAssessmentSearchResponse({
      id: 123,
      bookingId: 173722,
      status: AssessmentStatus.NOT_STARTED,
      previousStatus: null,
      createdTimestamp: '2021-01-11T12:13:00',
      lastUpdatedTimestamp: '2021-01-11T12:13:00',
    })

    await assessForEarlyRelease.stubGetAssessmentSearchResponse(prisonNumber, [
      assessmentSearchResponse1,
      assessmentSearchResponse2,
    ])

    await assessForEarlyRelease.stubGetCurrentAssessmentResponse(prisonNumber, createAssessmentResponse())

    // When
    await page.locator('#name-button-1').click()

    // Then
    expect(
      await page
        .getByRole('link', {
          name: 'Back',
          exact: true,
        })
        .getAttribute('href'),
    ).toEqual('#')

    await expect(page.getByText(`HDC application for Nestar Mogh`)).toBeVisible()

    // Offender checks

    const rows = page.locator('.govuk-summary-list__row')
    await assertKeyValue(rows, 0, `Name`, `Nestar Mogh`)
    await assertKeyValue(rows, 1, `Prison Number`, `A1234AE`)
    await assertKeyValue(rows, 2, `CRN`, `DX12340A`)
    await assertKeyValue(rows, 3, `DOB`, `20 Feb 2002`)
    await assertKeyValue(rows, 4, `Sentence Start Date`, `23 Jun 2028`)
    await assertKeyValue(rows, 5, `HDCED`, `23 Aug 2026`)
    await assertKeyValue(rows, 6, `CRD`, `23 Sep 2026`)
    await assertKeyValue(rows, 7, `Created`, `11/01/20 12:13`)
    await assertKeyValue(rows, 8, `Last Updated`, `12/02/20 12:13`)

    // Assessment checks
    const table = page.locator('.govuk-table')

    // First row
    const bookedId1 = table.locator('#bookingId-1')
    await expect(bookedId1).toBeVisible()
    await expect(bookedId1).toContainText('773722')

    const status1 = table.locator('#status-1')
    await expect(status1).toBeVisible()
    await expect(status1).toContainText('ELIGIBLE_AND_SUITABLE')

    const previousStatus1 = table.locator('#previousStatus-1')
    await expect(previousStatus1).toBeVisible()
    await expect(previousStatus1).toContainText('NOT_STARTED')

    const createdTimestamp1 = table.locator('#createdTimestamp-1')
    await expect(createdTimestamp1).toBeVisible()
    await expect(createdTimestamp1).toContainText('11/01/20 12:13')

    const lastUpdatedTimestamp1 = table.locator('#lastUpdatedTimestamp-1')
    await expect(lastUpdatedTimestamp1).toBeVisible()
    await expect(lastUpdatedTimestamp1).toContainText('12/01/20 12:13')

    const deletedDetails1 = table.locator('#deletedDetails-1')
    await expect(deletedDetails1).toBeVisible()
    await expect(deletedDetails1).toContainText('True 11/01/21 12:13')

    const options1 = table.locator('#options-2')
    await expect(options1).toBeVisible()
    await expect(options1).toContainText('View')

    // Second row
    const bookedId2 = table.locator('#bookingId-2')
    await expect(bookedId2).toBeVisible()
    await expect(bookedId2).toContainText('173722')

    const status2 = table.locator('#status-2')
    await expect(status2).toBeVisible()
    await expect(status2).toContainText('NOT_STARTED')

    const previousStatus2 = table.locator('#previousStatus-2')
    await expect(previousStatus2).toBeVisible()
    await expect(previousStatus2).toBeEmpty()

    const createdTimestamp2 = table.locator('#createdTimestamp-2')
    await expect(createdTimestamp2).toBeVisible()
    await expect(createdTimestamp2).toContainText('11/01/21 12:13')

    const lastUpdatedTimestamp2 = table.locator('#lastUpdatedTimestamp-2')
    await expect(lastUpdatedTimestamp2).toBeVisible()
    await expect(lastUpdatedTimestamp2).toContainText('11/01/21 12:13')

    const deletedDetails2 = table.locator('#deletedDetails-2')
    await expect(deletedDetails2).toBeVisible()
    await expect(deletedDetails2).toContainText('False')

    const options2 = table.locator('#options-2')
    await expect(options2).toBeVisible()
    await expect(options2).toContainText('View')
    await expect(options2).toContainText('Delete')
  })

  test('Delete connected assessment', async ({ page }) => {
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

    const assessmentSearchResponse1 = createAssessmentSearchResponse({ deletedTimestamp: '2021-01-11T12:13:00' })
    const assessmentSearchResponse2 = createAssessmentSearchResponse({
      status: AssessmentStatus.NOT_STARTED,
      previousStatus: null,
    })

    await assessForEarlyRelease.stubGetAssessmentSearchResponse(prisonNumber, [
      assessmentSearchResponse1,
      assessmentSearchResponse2,
    ])
    await assessForEarlyRelease.stubDeleteAssessment(assessmentSearchResponse1.id.toString())

    // When
    await page.locator('#delete-button-1').click()

    // Then
    await expect(page.getByText(`HDC application for Nestar Mogh`)).toBeVisible()

    const table = page.locator('.govuk-table')
    const bookedId1 = table.locator('#bookingId-1')
    await expect(bookedId1).toBeVisible()
    const bookedId2 = table.locator('#bookingId-2')
    await expect(bookedId2).toBeVisible()
  })

  async function assertKeyValue(rows: Locator, index: number, key: string, value: string) {
    const row = rows.nth(index)
    const keyItem = row.getByText(key, { exact: true })
    await expect(keyItem).toBeVisible()
    const valueItem = row.getByText(value, { exact: true })
    await expect(valueItem).toBeVisible()
  }
})
