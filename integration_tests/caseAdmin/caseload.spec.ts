import { expect, test } from '@playwright/test'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'
import { createOffenderSummary } from '../mockApis/assessForEarlyReleaseData'

import { login, resetStubs } from '../testUtils'
import paths from '../../server/routes/paths'
import { convertToTitleCase, formatDate, parseIsoDate } from '../../server/utils/utils'
import playwrightConfig from '../../playwright.config'
import AssessmentStatus from '../../server/enumeration/assessmentStatus'

test.describe('Case admin caseload', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Case admin can view caseload', async ({ page }) => {
    const prisonCode = 'MDI'

    const toWorkOnByYouOffender = createOffenderSummary({
      prisonNumber: 'A1234AE',
    })
    const postponedOffender = createOffenderSummary({
      prisonNumber: 'GU3243TH',
      forename: 'Dave',
      surname: 'Roberts',
      hdced: '2026-09-04',
      workingDaysToHdced: 15,
      isPostponed: true,
      postponementDate: '2025-04-25',
      postponementReason: 'Postponed for some reason',
      status: AssessmentStatus.POSTPONED,
    })
    const withDecisionMaker = createOffenderSummary({
      prisonNumber: 'GU8303TB',
      forename: 'Simon',
      surname: 'Adamson',
      hdced: '2027-04-09',
      workingDaysToHdced: 27,
      probationPractitioner: 'Russell Dickson',
      status: AssessmentStatus.AWAITING_DECISION,
    })
    const withProbationOffender = createOffenderSummary({
      prisonNumber: 'GU3243TB',
      forename: 'Tim',
      surname: 'Cook',
      hdced: '2026-12-04',
      workingDaysToHdced: 16,
      probationPractitioner: 'Mark James',
      status: AssessmentStatus.ADDRESS_AND_RISK_CHECKS_IN_PROGRESS,
    })
    await assessForEarlyRelease.stubGetCaseAdminCaseload(prisonCode, [
      toWorkOnByYouOffender,
      postponedOffender,
      withDecisionMaker,
      withProbationOffender,
    ])

    await login(page, { authorities: ['ROLE_LICENCE_CA'] })
    await page.goto(paths.prison.prisonCaseload({}))

    await expect(page.getByTestId('to-work-on-by-you')).toBeVisible()
    await expect(
      page.getByText(convertToTitleCase(`${toWorkOnByYouOffender.forename} ${toWorkOnByYouOffender.surname}`.trim())),
    ).toBeVisible()
    await expect(page.getByText(`Prison number: ${toWorkOnByYouOffender.prisonNumber}`)).toBeVisible()
    await expect(page.getByText(formatDate(parseIsoDate(toWorkOnByYouOffender.hdced), 'dd MMM yyyy'))).toBeVisible()
    await expect(page.getByText('10')).toBeVisible()

    await page.getByTestId('postponed').click()
    await expect(page).toHaveURL(`${playwrightConfig.use.baseURL}${paths.prison.prisonCaseload({})}#postponed`)
    await expect(
      page.getByText(convertToTitleCase(`${postponedOffender.forename} ${postponedOffender.surname}`.trim())),
    ).toBeVisible()
    await expect(page.getByText(`Prison number: ${postponedOffender.prisonNumber}`)).toBeVisible()
    await expect(page.getByText(formatDate(parseIsoDate(postponedOffender.hdced), 'dd MMM yyyy'))).toBeVisible()
    await expect(page.getByText('15')).toBeVisible()
    await expect(
      page.getByText(formatDate(parseIsoDate(postponedOffender.postponementDate), 'dd MMM yyyy')),
    ).toBeVisible()
    await expect(page.getByText(postponedOffender.postponementReason)).toBeVisible()

    await page.getByTestId('with-probation').click()
    await expect(page).toHaveURL(`${playwrightConfig.use.baseURL}${paths.prison.prisonCaseload({})}#with-probation`)
    await expect(
      page.getByText(convertToTitleCase(`${withProbationOffender.forename} ${withProbationOffender.surname}`.trim())),
    ).toBeVisible()
    await expect(page.getByText(`Prison number: ${withProbationOffender.prisonNumber}`)).toBeVisible()
    await expect(
      page.getByText(convertToTitleCase(`${withProbationOffender.probationPractitioner}`.trim())),
    ).toBeVisible()
    await expect(page.getByText(formatDate(parseIsoDate(withProbationOffender.hdced), 'dd MMM yyyy'))).toBeVisible()
  })

  test('Case admin inactive applications caseload', async ({ page }) => {
    const prisonCode = 'MDI'

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
    await assessForEarlyRelease.stubGetCaseAdminCaseload(prisonCode, [refusedOffender, timedOutOffender])

    await login(page, { authorities: ['ROLE_LICENCE_CA'] })
    await page.goto(`${paths.prison.prisonCaseload({})}?view=inactive-applications`)

    await expect(page.getByTestId('inactive-applications')).toBeVisible()
    await expect(page.getByText(`${refusedOffender.forename} ${refusedOffender.surname}`.trim())).toBeVisible()
    await expect(page.getByText(`Prison number: ${refusedOffender.prisonNumber}`)).toBeVisible()
    await expect(page.getByText('Mark James')).toBeVisible()

    await expect(page.getByText(`${timedOutOffender.forename} ${timedOutOffender.surname}`.trim())).toBeVisible()
    await expect(page.getByText(`Prison number: ${timedOutOffender.prisonNumber}`)).toBeVisible()
    await expect(page.getByText('Mark Coombes	')).toBeVisible()
  })
})
