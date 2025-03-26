import { expect, test } from '@playwright/test'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'
import { createOffenderSummary } from '../mockApis/assessForEarlyReleaseData'

import { login, resetStubs } from '../testUtils'
import paths from '../../server/routes/paths'
import { convertToTitleCase, formatDate, parseIsoDate } from '../../server/utils/utils'
import AssessmentStatus from '../../server/enumeration/assessmentStatus'
import { createStaffDetails } from '../../server/data/__testutils/testObjects'

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
    const timedOutOffender = createOffenderSummary({
      prisonNumber: 'G3243TH',
      forename: 'Dave',
      surname: 'Roberts',
      hdced: '2026-09-04',
      workingDaysToHdced: 15,
      status: AssessmentStatus.TIMED_OUT,
    })

    await assessForEarlyRelease.stubGetComCaseload(staffCode, [activeOffender, timedOutOffender])
    await login(page, { authorities: ['ROLE_LICENCE_RO'], authSource: 'delius' })
    await page.goto(paths.probation.probationCaseload({}))

    await expect(
      page.getByText(convertToTitleCase(`${activeOffender.forename} ${activeOffender.surname}`.trim())),
    ).toBeVisible()
    await expect(page.getByText(formatDate(parseIsoDate(activeOffender.hdced), 'dd MMM yyyy'))).toBeVisible()

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
