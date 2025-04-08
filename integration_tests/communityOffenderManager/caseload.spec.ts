import { expect, test } from '@playwright/test'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'
import { createOffenderSummary } from '../mockApis/assessForEarlyReleaseData'

import { login, resetStubs } from '../testUtils'
import paths from '../../server/routes/paths'
import { convertToTitleCase, formatDate, parseIsoDate } from '../../server/utils/utils'
import AssessmentStatus from '../../server/enumeration/assessmentStatus'
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

  test('Can view active applications', async ({ page }) => {
    const activeOffender = createOffenderSummary({
      prisonNumber: 'A1234AE',
    })
    const postponedOffender = createOffenderSummary({
      prisonNumber: 'G3243TH',
      crn: 'W493087',
      forename: 'Dave',
      surname: 'Roberts',
      hdced: '2026-09-04',
      workingDaysToHdced: 15,
      isPostponed: true,
      postponementDate: '2025-04-25',
      postponementReasons: ['Postponed for some reason'],
      status: AssessmentStatus.POSTPONED,
    })
    const readyForReleaseOffender = createOffenderSummary({
      prisonNumber: 'K8932TE',
      crn: 'Z456712',
      forename: 'Brian',
      surname: 'Morrish',
      hdced: '2026-10-25',
      workingDaysToHdced: 3,
      probationPractitioner: 'David Newton',
      status: AssessmentStatus.PASSED_PRE_RELEASE_CHECKS,
    })
    const timedOutOffender = createOffenderSummary({
      prisonNumber: 'G3243TH',
      forename: 'Dave',
      surname: 'Roberts',
      hdced: '2026-09-04',
      workingDaysToHdced: 15,
      status: AssessmentStatus.TIMED_OUT,
    })
    const toWorkOnByYouCases = createOffenderSummary({
      prisonNumber: 'G3243TB',
      forename: 'Tim',
      surname: 'Cook',
      hdced: '2026-12-06',
      workingDaysToHdced: 10,
      status: AssessmentStatus.ELIGIBILITY_AND_SUITABILITY_IN_PROGRESS,
    })

    await assessForEarlyRelease.stubGetComCaseload(staffCode, [
      activeOffender,
      postponedOffender,
      readyForReleaseOffender,
      timedOutOffender,
      toWorkOnByYouCases,
    ])
    await login(page, { authorities: ['ROLE_LICENCE_RO'], authSource: 'delius' })
    await page.goto(paths.probation.probationCaseload({}))

    await expect(
      page.getByText(convertToTitleCase(`${toWorkOnByYouCases.forename} ${toWorkOnByYouCases.surname}`.trim())),
    ).toBeVisible()
    await expect(
      page.getByText(convertToTitleCase(`${activeOffender.forename} ${activeOffender.surname}`.trim())),
    ).toBeVisible()
    await expect(page.getByText(formatDate(parseIsoDate(activeOffender.hdced), 'dd MMM yyyy'))).toBeVisible()

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
  })

  test('Can view inactive applications', async ({ page }) => {
    const refusedOffender = createOffenderSummary({
      prisonNumber: 'GU3243TH',
      forename: 'Dave',
      surname: 'Roberts',
      hdced: '2026-09-04',
      workingDaysToHdced: 15,
      probationPractitioner: 'Mark James',
      status: AssessmentStatus.REFUSED,
    })
    const timedOutOffender = createOffenderSummary({
      prisonNumber: 'GU3243TB',
      forename: 'Tim',
      surname: 'Cook',
      hdced: '2026-12-04',
      workingDaysToHdced: 16,
      status: AssessmentStatus.TIMED_OUT,
    })

    await assessForEarlyRelease.stubGetComCaseload(staffCode, [refusedOffender, timedOutOffender])

    await login(page, { authorities: ['ROLE_LICENCE_RO'], authSource: 'delius' })
    await page.goto(`${paths.probation.probationCaseload({})}?view=inactive-applications`)

    await expect(page.getByTestId('inactive-applications')).toBeVisible()
    await expect(page.getByText(`${refusedOffender.forename} ${refusedOffender.surname}`.trim())).toBeVisible()

    await expect(page.getByText(`${timedOutOffender.forename} ${timedOutOffender.surname}`.trim())).toBeVisible()
  })
})
