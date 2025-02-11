import { expect, test } from '@playwright/test'
import { differenceInDays, startOfDay } from 'date-fns'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'
import { assessmentSummary, createOffenderSummary } from '../mockApis/assessForEarlyReleaseData'

import { login, resetStubs } from '../testUtils'
import paths from '../../server/routes/paths'
import { _OffenderSummary } from '../../server/@types/assessForEarlyReleaseApiClientTypes'
import { convertToTitleCase, formatDate, parseIsoDate } from '../../server/utils/utils'
import playwrightConfig from '../../playwright.config'

test.describe('Case admin caseload', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Case admin can view caseload', async ({ page }) => {
    const prisonCode = 'MDI'
    const prisonNumber = 'A1234AE'

    const toWorkOnByYouOffender = createOffenderSummary(prisonNumber)
    const postponedOffender: _OffenderSummary = {
      ...createOffenderSummary(prisonNumber),
      prisonNumber: 'GU3243TH',
      forename: 'Dave',
      surname: 'Roberts',
      hdced: '2026-09-04',
      isPostponed: true,
      postponementDate: '2025-04-25',
      postponementReason: 'Postponed for some reason',
    }
    await assessForEarlyRelease.stubGetCaseAdminCaseload(prisonCode, [toWorkOnByYouOffender, postponedOffender])
    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummary(prisonNumber))

    await login(page, { authorities: ['ROLE_LICENCE_CA'] })
    await page.goto(paths.prison.prisonCaseload({}))

    await expect(page.getByTestId('to-work-on-by-you')).toBeVisible()
    await expect(
      page.getByText(convertToTitleCase(`${toWorkOnByYouOffender.forename} ${toWorkOnByYouOffender.surname}`.trim())),
    ).toBeVisible()
    await expect(page.getByText(`Prison number: ${toWorkOnByYouOffender.prisonNumber}`)).toBeVisible()
    await expect(page.getByText(formatDate(parseIsoDate(toWorkOnByYouOffender.hdced), 'dd MMM yyyy'))).toBeVisible()
    await expect(
      page.getByText(`${differenceInDays(toWorkOnByYouOffender.hdced, startOfDay(new Date()))}`),
    ).toBeVisible()

    await page.getByTestId('postponed').click()
    await expect(page).toHaveURL(`${playwrightConfig.use.baseURL}${paths.prison.prisonCaseload({})}#postponed`)
    await expect(
      page.getByText(convertToTitleCase(`${postponedOffender.forename} ${postponedOffender.surname}`.trim())),
    ).toBeVisible()
    await expect(page.getByText(`Prison number: ${postponedOffender.prisonNumber}`)).toBeVisible()
    await expect(page.getByText(formatDate(parseIsoDate(postponedOffender.hdced), 'dd MMM yyyy'))).toBeVisible()
    await expect(page.getByText(`${differenceInDays(postponedOffender.hdced, startOfDay(new Date()))}`)).toBeVisible()
    await expect(
      page.getByText(formatDate(parseIsoDate(postponedOffender.postponementDate), 'dd MMM yyyy')),
    ).toBeVisible()
    await expect(page.getByText(postponedOffender.postponementReason)).toBeVisible()
  })
})
