import { expect, test } from '@playwright/test'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'
import { assessmentSummary } from '../mockApis/assessForEarlyReleaseData'

import { login, resetStubs } from '../testUtils'
import paths from '../../server/routes/paths'
import AssessmentStatus from '../../server/enumeration/assessmentStatus'

test.describe('Case admin forms', () => {
  test.afterEach(async () => {
    await resetStubs()
  })

  test('Case admin can view forms', async ({ page }) => {
    // Given
    const prisonNumber: string = 'A1234AE'
    const assessmentSummaryDto = assessmentSummary(prisonNumber, AssessmentStatus.NOT_STARTED)
    const fullName = `${assessmentSummaryDto.forename} ${assessmentSummaryDto.surname}`

    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummaryDto)
    await login(page, { authorities: ['ROLE_LICENCE_CA'] })

    // When
    await page.goto(`${paths.prison.assessment.home({ prisonNumber })}#forms`)

    // Then
    await expect(page.getByText(`HDC application for ${fullName}`)).toBeVisible()

    await expect(page.getByRole('heading', { name: 'Forms' })).toBeVisible()
    await expect(page.getByText('These forms will open in a new tab for printing.')).toBeVisible()

    await expect(page.getByLabel('Forms').getByRole('link', { name: 'Eligible', exact: true })).not.toBeVisible()
    await expect(
      page.getByLabel('Forms').getByRole('link', { name: 'Information about address checks', exact: true }),
    ).not.toBeVisible()
    await expect(page.getByLabel('Forms').getByRole('link', { name: 'Address checks', exact: true })).not.toBeVisible()
    await expect(page.getByLabel('Forms').getByRole('link', { name: 'Opt out', exact: true })).not.toBeVisible()
  })

  test('Case admin can view forms when assessment status is ELIGIBLE_AND_SUITABLE', async ({ page }) => {
    // When
    const prisonNumber: string = 'A1234AE'
    const assessmentOverviewSummary = assessmentSummary(prisonNumber, AssessmentStatus.ELIGIBLE_AND_SUITABLE)
    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentOverviewSummary)
    await login(page, { authorities: ['ROLE_LICENCE_CA'] })
    await page.goto(`${paths.prison.assessment.home({ prisonNumber })}#forms`)

    // Then
    await expect(page.getByLabel('Forms').getByRole('link', { name: 'Eligible', exact: true })).toBeVisible()
    await expect(
      page.getByLabel('Forms').getByRole('link', { name: 'Information about address checks', exact: true }),
    ).toBeVisible()
    await expect(page.getByLabel('Forms').getByRole('link', { name: 'Address checks', exact: true })).toBeVisible()
    await expect(page.getByLabel('Forms').getByRole('link', { name: 'Opt out', exact: true })).toBeVisible()
    await expect(page.getByLabel('Forms').getByRole('link', { name: 'Not eligible', exact: true })).not.toBeVisible()
    await expect(page.getByLabel('Forms').getByRole('link', { name: 'Not suitable', exact: true })).not.toBeVisible()

    // Check href attributes
    await expect(page.getByLabel('Forms').getByRole('link', { name: 'Eligible', exact: true })).toHaveAttribute(
      'href',
      paths.offender.document({ prisonNumber, documentSubjectType: 'OFFENDER_ELIGIBLE_FORM' }),
    )
    await expect(
      page.getByLabel('Forms').getByRole('link', { name: 'Information about address checks', exact: true }),
    ).toHaveAttribute(
      'href',
      paths.offender.document({ prisonNumber, documentSubjectType: 'OFFENDER_ADDRESS_CHECKS_INFORMATION_FORM' }),
    )
    await expect(page.getByLabel('Forms').getByRole('link', { name: 'Address checks', exact: true })).toHaveAttribute(
      'href',
      paths.offender.document({ prisonNumber, documentSubjectType: 'OFFENDER_ADDRESS_CHECKS_FORM' }),
    )
    await expect(page.getByLabel('Forms').getByRole('link', { name: 'Opt out', exact: true })).toHaveAttribute(
      'href',
      paths.offender.document({ prisonNumber, documentSubjectType: 'OFFENDER_OPT_OUT_FORM' }),
    )
  })

  test('Case admin can view forms when assessment status is INELIGIBLE_OR_UNSUITABLE', async ({ page }) => {
    // When
    const prisonNumber: string = 'A1234AE'
    const assessmentOverviewSummary1 = assessmentSummary(prisonNumber, AssessmentStatus.INELIGIBLE_OR_UNSUITABLE)
    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentOverviewSummary1)
    await login(page, { authorities: ['ROLE_LICENCE_CA'] })
    await page.goto(`${paths.prison.assessment.home({ prisonNumber })}#forms`)

    // Then
    await expect(page.getByLabel('Forms').getByRole('link', { name: 'Eligible', exact: true })).not.toBeVisible()
    await expect(
      page.getByLabel('Forms').getByRole('link', { name: 'Information about address checks', exact: true }),
    ).not.toBeVisible()
    await expect(page.getByLabel('Forms').getByRole('link', { name: 'Address checks', exact: true })).not.toBeVisible()
    await expect(page.getByLabel('Forms').getByRole('link', { name: 'Opt out', exact: true })).not.toBeVisible()
    await expect(page.getByLabel('Forms').getByRole('link', { name: 'Not eligible', exact: true })).toBeVisible()
    await expect(page.getByLabel('Forms').getByRole('link', { name: 'Not suitable', exact: true })).toBeVisible()

    // Check href attributes
    await expect(page.getByLabel('Forms').getByRole('link', { name: 'Not eligible', exact: true })).toHaveAttribute(
      'href',
      paths.offender.document({ prisonNumber, documentSubjectType: 'OFFENDER_NOT_ELIGIBLE_FORM' }),
    )
    await expect(page.getByLabel('Forms').getByRole('link', { name: 'Not suitable', exact: true })).toHaveAttribute(
      'href',
      paths.offender.document({ prisonNumber, documentSubjectType: 'OFFENDER_NOT_SUITABLE_FORM' }),
    )
  })
})
