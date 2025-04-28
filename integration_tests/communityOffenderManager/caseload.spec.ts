import { expect, test } from '@playwright/test'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'
import {
  createOffenderSummary,
  postponedOffender,
  readyForReleaseOffender,
  refusedOffender,
  timedOutOffender,
  toWorkOnByComCases,
  withPrisonOffender,
} from '../mockApis/assessForEarlyReleaseData'

import { login, resetStubs } from '../testUtils'
import paths from '../../server/routes/paths'
import { convertToTitleCase, formatDate, parseIsoDate } from '../../server/utils/utils'
import { createStaffDetails } from '../../server/data/__testutils/testObjects'
import playwrightConfig from '../../playwright.config'
import AssessmentStatus from '../../server/enumeration/assessmentStatus'

const staffCode = 'STAFF1'

test.describe('COM caseload', () => {
  test.beforeEach(async () => {
    await assessForEarlyRelease.stubDeliusStaff('USER1', createStaffDetails({ code: staffCode }))
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can view my cases', async ({ page }) => {
    const withDecisionMaker = createOffenderSummary({
      prisonNumber: 'G8303TB',
      forename: 'Simon',
      surname: 'Adamson',
      hdced: '2027-04-09',
      workingDaysToHdced: 27,
      probationPractitioner: 'Russell Dickson',
      status: AssessmentStatus.AWAITING_DECISION,
    })

    await assessForEarlyRelease.stubGetComStaffCaseload(staffCode, [
      postponedOffender,
      readyForReleaseOffender,
      timedOutOffender,
      toWorkOnByComCases,
      withDecisionMaker,
      withPrisonOffender,
    ])
    await login(page, { authorities: ['ROLE_LICENCE_RO'], authSource: 'delius' })
    await page.goto(paths.probation.probationCaseload({}))

    // To be worked on by you tab
    await expect(
      page.getByText(convertToTitleCase(`${toWorkOnByComCases.forename} ${toWorkOnByComCases.surname}`.trim())),
    ).toBeVisible()
    await expect(page.getByText(formatDate(parseIsoDate(toWorkOnByComCases.hdced), 'dd MMM yyyy'))).toBeVisible()
    await expect(page.getByTestId('to-work-on-by-you')).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Aled Evans' })).toBeVisible()

    // With prison admin Tab
    await page.getByTestId('with-prison-admin').click()
    await expect(page.getByLabel('With prison admin').getByText('Aled Evans')).toBeVisible()

    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.probation.probationCaseload({})}#with-prison-admin`,
    )
    await expect(
      page.getByText(convertToTitleCase(`${withPrisonOffender.forename} ${withPrisonOffender.surname}`.trim())),
    ).toBeVisible()
    await expect(page.getByText(`CRN: ${withPrisonOffender.crn}`)).toBeVisible()

    // With Decision Maker Tab
    await page.getByTestId('with-decision-maker').click()
    await expect(page.getByLabel('With decision maker').getByText('Aled Evans')).toBeVisible()

    // Postponed Tab
    await page.getByTestId('postponed').click()
    await expect(page).toHaveURL(`${playwrightConfig.use.baseURL}${paths.probation.probationCaseload({})}#postponed`)
    await expect(
      page.getByText(convertToTitleCase(`${postponedOffender.forename} ${postponedOffender.surname}`.trim())),
    ).toBeVisible()

    await expect(page.getByText(`CRN: ${postponedOffender.crn}`)).toBeVisible()

    // Ready for release Tab
    await page.getByTestId('ready-for-release').click()
    await expect(page.getByLabel('Ready for release').getByText('Aled Evans')).toBeVisible()

    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.probation.probationCaseload({})}#ready-for-release`,
    )
    await expect(
      page.getByText(
        convertToTitleCase(`${readyForReleaseOffender.forename} ${readyForReleaseOffender.surname}`.trim()),
      ),
    ).toBeVisible()
    await expect(page.getByText(`CRN: ${readyForReleaseOffender.crn}`)).toBeVisible()

    await expect(
      page.getByText(convertToTitleCase(`${timedOutOffender.forename} ${timedOutOffender.surname}`.trim())),
    ).not.toBeVisible()
  })

  test('Can view team cases', async ({ page }) => {
    await assessForEarlyRelease.stubGetComTeamCaseload(staffCode, [
      postponedOffender,
      readyForReleaseOffender,
      timedOutOffender,
      toWorkOnByComCases,
      withPrisonOffender,
    ])
    await login(page, { authorities: ['ROLE_LICENCE_RO'], authSource: 'delius' })
    await page.goto(`${paths.probation.probationCaseload({})}?view=team-cases`)

    await expect(
      page.getByText(convertToTitleCase(`${toWorkOnByComCases.forename} ${toWorkOnByComCases.surname}`.trim())),
    ).toBeVisible()

    await page.getByTestId('postponed').click()
    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.probation.probationCaseload({})}?view=team-cases#postponed`,
    )
    await expect(
      page.getByText(convertToTitleCase(`${postponedOffender.forename} ${postponedOffender.surname}`.trim())),
    ).toBeVisible()

    await page.getByTestId('ready-for-release').click()
    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.probation.probationCaseload({})}?view=team-cases#ready-for-release`,
    )
    await expect(
      page.getByText(
        convertToTitleCase(`${readyForReleaseOffender.forename} ${readyForReleaseOffender.surname}`.trim()),
      ),
    ).toBeVisible()

    await expect(
      page.getByText(convertToTitleCase(`${timedOutOffender.forename} ${timedOutOffender.surname}`.trim())),
    ).not.toBeVisible()

    await page.getByTestId('with-prison-admin').click()
    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.probation.probationCaseload({})}?view=team-cases#with-prison-admin`,
    )
    await expect(
      page.getByText(convertToTitleCase(`${withPrisonOffender.forename} ${withPrisonOffender.surname}`.trim())),
    ).toBeVisible()
  })

  test('Can view inactive applications', async ({ page }) => {
    await assessForEarlyRelease.stubGetComStaffCaseload(staffCode, [refusedOffender, timedOutOffender])

    await login(page, { authorities: ['ROLE_LICENCE_RO'], authSource: 'delius' })
    await page.goto(`${paths.probation.probationCaseload({})}?view=inactive-applications`)

    await expect(page.getByTestId('inactive-applications')).toBeVisible()
    await expect(page.getByText(`${refusedOffender.forename} ${refusedOffender.surname}`.trim())).toBeVisible()

    await expect(page.getByText(`${timedOutOffender.forename} ${timedOutOffender.surname}`.trim())).toBeVisible()
  })
})
