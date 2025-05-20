import { expect, test } from '@playwright/test'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'
import {
  createOffenderSummary,
  postponedOffender,
  assessmentCompletedOffender,
  refusedOffender,
  timedOutOffender,
} from '../mockApis/assessForEarlyReleaseData'

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
    const withDecisionMaker = createOffenderSummary({
      prisonNumber: 'G8303TB',
      forename: 'Kaluk',
      surname: 'Mrith',
      hdced: '2027-04-09',
      workingDaysToHdced: 27,
      probationPractitioner: 'Russell Dickson',
      status: AssessmentStatus.AWAITING_DECISION,
    })
    const withProbationOffender = createOffenderSummary({
      prisonNumber: 'G3243TB',
      forename: 'Keth',
      surname: 'Chang',
      hdced: '2026-12-04',
      workingDaysToHdced: 16,
      probationPractitioner: 'Kagran Darj',
      status: AssessmentStatus.AWAITING_ADDRESS_AND_RISK_CHECKS,
    })

    await assessForEarlyRelease.stubGetCaseAdminCaseload(prisonCode, [
      toWorkOnByYouOffender,
      postponedOffender,
      withDecisionMaker,
      withProbationOffender,
      assessmentCompletedOffender,
    ])

    await login(page, { authorities: ['ROLE_LICENCE_CA'] })
    await page.goto(paths.prison.prisonCaseload({}))

    // To be worked on by you tab
    await expect(page.getByTestId('to-work-on-by-you')).toBeVisible()
    await expect(
      page.getByText(convertToTitleCase(`${toWorkOnByYouOffender.forename} ${toWorkOnByYouOffender.surname}`.trim())),
    ).toBeVisible()
    await expect(page.getByText(`Prison number: ${toWorkOnByYouOffender.prisonNumber}`)).toBeVisible()
    await expect(page.getByText(formatDate(parseIsoDate(toWorkOnByYouOffender.hdced), 'dd MMM yyyy'))).toBeVisible()
    await expect(page.getByText('10')).toBeVisible()

    await expect(page.getByRole('cell', { name: 'Reli Boral' })).toBeVisible()

    // With Probation Tab
    await page.getByTestId('with-probation').click()
    await expect(page.getByLabel('With probation').getByText('Reli Boral')).toBeVisible()

    await expect(page).toHaveURL(`${playwrightConfig.use.baseURL}${paths.prison.prisonCaseload({})}#with-probation`)
    await expect(
      page.getByText(convertToTitleCase(`${withProbationOffender.forename} ${withProbationOffender.surname}`.trim())),
    ).toBeVisible()
    await expect(page.getByText(`Prison number: ${withProbationOffender.prisonNumber}`)).toBeVisible()
    await expect(
      page.getByText(convertToTitleCase(`${withProbationOffender.probationPractitioner}`.trim())),
    ).toBeVisible()
    await expect(page.getByText(formatDate(parseIsoDate(withProbationOffender.hdced), 'dd MMM yyyy'))).toBeVisible()

    // With Decision Maker Tab
    await page.getByTestId('with-decision-maker').click()
    await expect(page.getByLabel('With decision maker').getByText('Reli Boral')).toBeVisible()

    // Postponed Tab
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
    await expect(page.getByText(postponedOffender.postponementReasons[0])).toBeVisible()

    // Assessment completed Tab
    await page.getByTestId('assessment-completed').click()
    await expect(page.getByLabel('Assessment completed').getByText('Reli Boral')).toBeVisible()

    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.prison.prisonCaseload({})}#assessment-completed`,
    )
    await expect(
      page.getByText(
        convertToTitleCase(`${assessmentCompletedOffender.forename} ${assessmentCompletedOffender.surname}`.trim()),
      ),
    ).toBeVisible()
    await expect(page.getByText(`Prison number: ${assessmentCompletedOffender.prisonNumber}`)).toBeVisible()
    await expect(
      page.getByText(convertToTitleCase(`${assessmentCompletedOffender.probationPractitioner}`.trim())),
    ).toBeVisible()
    await expect(
      page.getByText(formatDate(parseIsoDate(assessmentCompletedOffender.hdced), 'dd MMM yyyy')),
    ).toBeVisible()
  })

  test('Case admin inactive applications caseload', async ({ page }) => {
    const prisonCode = 'MDI'

    await assessForEarlyRelease.stubGetCaseAdminCaseload(prisonCode, [refusedOffender, timedOutOffender])

    await login(page, { authorities: ['ROLE_LICENCE_CA'] })
    await page.goto(`${paths.prison.prisonCaseload({})}?view=inactive-applications`)

    await expect(page.getByTestId('inactive-applications')).toBeVisible()
    await expect(page.getByText(`${refusedOffender.forename} ${refusedOffender.surname}`.trim())).toBeVisible()
    await expect(page.getByText(`Prison number: ${refusedOffender.prisonNumber}`)).toBeVisible()
    await expect(page.getByText('Kagran Darj')).toBeVisible()

    await expect(page.getByText(`${timedOutOffender.forename} ${timedOutOffender.surname}`.trim())).toBeVisible()
    await expect(page.getByText(`Prison number: ${timedOutOffender.prisonNumber}`)).toBeVisible()
    await expect(page.getByText('Shena Elas	')).toBeVisible()
  })
})
