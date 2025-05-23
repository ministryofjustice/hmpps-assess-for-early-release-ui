import { expect, test } from '@playwright/test'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'
import {
  withDecisionMaker,
  postponedOffender,
  assessmentCompletedOffender,
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
      assessmentCompletedOffender,
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
    await expect(page.getByRole('cell', { name: 'Reli Boral' })).toBeVisible()

    // With prison admin Tab
    await page.getByTestId('with-prison-admin').click()
    await expect(page.getByLabel('With prison admin').getByText('Reli Boral')).toBeVisible()

    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.probation.probationCaseload({})}#with-prison-admin`,
    )
    await expect(
      page.getByText(convertToTitleCase(`${withPrisonOffender.forename} ${withPrisonOffender.surname}`.trim())),
    ).toBeVisible()
    await expect(page.getByText(`CRN: ${withPrisonOffender.crn}`)).toBeVisible()

    // With Decision Maker Tab
    await page.getByTestId('with-decision-maker').click()
    await expect(page.getByLabel('With decision maker').getByText('Reli Boral')).toBeVisible()

    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.probation.probationCaseload({})}#with-decision-maker`,
    )
    await expect(
      page.getByText(convertToTitleCase(`${withDecisionMaker.forename} ${withDecisionMaker.surname}`.trim())),
    ).toBeVisible()
    await expect(page.getByText(`Prison number: ${withDecisionMaker.prisonNumber}`)).toBeVisible()

    // Postponed Tab
    await page.getByTestId('postponed').click()
    await expect(page).toHaveURL(`${playwrightConfig.use.baseURL}${paths.probation.probationCaseload({})}#postponed`)
    await expect(
      page.getByText(convertToTitleCase(`${postponedOffender.forename} ${postponedOffender.surname}`.trim())),
    ).toBeVisible()

    await expect(page.getByText(`CRN: ${postponedOffender.crn}`)).toBeVisible()

    // Assessment Completed Tab
    await page.getByTestId('assessment-completed').click()
    await expect(page.getByLabel('Assessment Completed').getByText('Reli Boral')).toBeVisible()

    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.probation.probationCaseload({})}#assessment-completed`,
    )
    await expect(
      page.getByText(
        convertToTitleCase(`${assessmentCompletedOffender.forename} ${assessmentCompletedOffender.surname}`.trim()),
      ),
    ).toBeVisible()
    await expect(page.getByText(`CRN: ${assessmentCompletedOffender.crn}`)).toBeVisible()

    await expect(
      page.getByText(convertToTitleCase(`${timedOutOffender.forename} ${timedOutOffender.surname}`.trim())),
    ).not.toBeVisible()
  })

  test('Can view team cases', async ({ page }) => {
    await assessForEarlyRelease.stubGetComTeamCaseload(staffCode, [
      postponedOffender,
      assessmentCompletedOffender,
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

    await page.getByTestId('assessment-completed').click()
    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.probation.probationCaseload({})}?view=team-cases#assessment-completed`,
    )
    await expect(
      page.getByText(
        convertToTitleCase(`${assessmentCompletedOffender.forename} ${assessmentCompletedOffender.surname}`.trim()),
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
