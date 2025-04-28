import { expect, test } from '@playwright/test'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'
import { assessmentSummary } from '../mockApis/assessForEarlyReleaseData'

import { login, resetStubs } from '../testUtils'
import paths from '../../server/routes/paths'
import AssessmentStatus from '../../server/enumeration/assessmentStatus'
import { formatDate, parseIsoDate } from '../../server/utils/utils'

test.describe('Case admin assessment', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Case admin can view assessment', async ({ page }) => {
    // Given
    const prisonNumber: string = 'A1234AE'
    const assessmentSummaryDto = assessmentSummary(prisonNumber, AssessmentStatus.NOT_STARTED)
    const fullName = `${assessmentSummaryDto.forename} ${assessmentSummaryDto.surname}`

    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummaryDto)
    await assessForEarlyRelease.stubGetAssessmentContacts(prisonNumber)
    await login(page, { authorities: ['ROLE_LICENCE_CA'] })

    // When
    await page.goto(paths.prison.assessment.home({ prisonNumber }))

    // Then
    await expect(page.getByText(`HDC application for ${fullName}`)).toBeVisible()

    const dpsPrisonerProfileLink = await page.getByRole('link', { name: 'See full DPS profile' }).getAttribute('href')
    expect(dpsPrisonerProfileLink).toContain(
      `http://localhost:9091/dps-prisoner-profile/save-backlink?service=assess-for-early-release&returnPath=/omu/application-overview/${prisonNumber}&redirectPath=/prisoner/${prisonNumber}`,
    )

    const definitionsTerm = page.getByRole('term')
    await expect(definitionsTerm.getByText('Name')).toBeVisible()
    await expect(definitionsTerm.getByText('Prison Number')).toBeVisible()
    await expect(definitionsTerm.getByText('Main Offence')).toBeVisible()
    await expect(definitionsTerm.getByText('HDCED')).toBeVisible()
    await expect(definitionsTerm.getByText('CRD')).toBeVisible()
    await expect(definitionsTerm.getByText('Location')).toBeVisible()
    await expect(definitionsTerm.getByText('Cell number')).toBeVisible()

    const definitions = page.getByRole('definition')

    await expect(definitions.getByText(fullName)).toBeVisible()
    await expect(definitions.getByText(prisonNumber)).toBeVisible()
    await expect(definitions.getByText(assessmentSummaryDto.mainOffense)).toBeVisible()
    await expect(
      definitions.getByText(formatDate(parseIsoDate(assessmentSummaryDto.hdced), 'dd MMM yyyy')),
    ).toBeVisible()
    await expect(definitions.getByText(formatDate(parseIsoDate(assessmentSummaryDto.crd), 'dd MMM yyyy'))).toBeVisible()
    await expect(definitions.getByText(assessmentSummaryDto.location)).toBeVisible()
    await expect(definitions.getByText(assessmentSummaryDto.cellLocation)).toBeVisible()
  })
})
