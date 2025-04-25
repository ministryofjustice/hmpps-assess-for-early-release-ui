import { expect, test } from '@playwright/test'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'
import {
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

const staffCode = 'STAFF1'

test.describe('COM caseload', () => {
  test.beforeEach(async () => {
    await assessForEarlyRelease.stubDeliusStaff('USER1', createStaffDetails({ code: staffCode }))
  })

  test.afterEach(async () => {
    await resetStubs()
  })

  test('Can view my cases', async ({ page }) => {
    await assessForEarlyRelease.stubGetComStaffCaseload(staffCode, [
      postponedOffender,
      readyForReleaseOffender,
      timedOutOffender,
      toWorkOnByComCases,
      withPrisonOffender,
    ])
    await login(page, { authorities: ['ROLE_LICENCE_RO'], authSource: 'delius' })
    await page.goto(paths.probation.probationCaseload({}))

    await expect(
      page.getByText(convertToTitleCase(`${toWorkOnByComCases.forename} ${toWorkOnByComCases.surname}`.trim())),
    ).toBeVisible()
    await expect(page.getByText(formatDate(parseIsoDate(toWorkOnByComCases.hdced), 'dd MMM yyyy'))).toBeVisible()

    await page.getByTestId('postponed').click()
    await expect(page).toHaveURL(`${playwrightConfig.use.baseURL}${paths.probation.probationCaseload({})}#postponed`)
    await expect(
      page.getByText(convertToTitleCase(`${postponedOffender.forename} ${postponedOffender.surname}`.trim())),
    ).toBeVisible()

    await expect(page.getByText(`CRN: ${postponedOffender.crn}`)).toBeVisible()

    await page.getByTestId('ready-for-release').click()
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

    await page.getByTestId('with-prison-admin').click()
    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.probation.probationCaseload({})}#with-prison-admin`,
    )
    await expect(
      page.getByText(convertToTitleCase(`${withPrisonOffender.forename} ${withPrisonOffender.surname}`.trim())),
    ).toBeVisible()
    await expect(page.getByText(`CRN: ${withPrisonOffender.crn}`)).toBeVisible()
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
