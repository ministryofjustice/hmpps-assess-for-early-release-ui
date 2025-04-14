import { expect, test } from '@playwright/test'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'
import { login, resetStubs } from '../testUtils'
import paths from '../../server/routes/paths'

import {
  assessmentSummary,
  eligibilityCriterion1Completed,
  suitabilityCriterionComplete,
} from '../mockApis/assessForEarlyReleaseData'

test.describe('Suitability checks', () => {
  test.beforeEach(async () => {
    await resetStubs()
  })

  test('Case admin can see who completed a suitability check', async ({ page }) => {
    const prisonNumber = 'A1234AE'
    const anAssessmentSummary = assessmentSummary(prisonNumber)
    await assessForEarlyRelease.stubSaveCriterionAnswers(
      anAssessmentSummary,
      [
        {
          ...eligibilityCriterion1Completed,
          status: 'ELIGIBLE',
        },
      ],
      [
        {
          ...suitabilityCriterionComplete,
          status: 'SUITABLE',
        },
      ],
      'ELIGIBLE',
      'ELIGIBLE',
    )

    await assessForEarlyRelease.stubGetEligibilityAndSuitability(
      anAssessmentSummary,
      [
        {
          ...eligibilityCriterion1Completed,
          status: 'ELIGIBLE',
        },
      ],
      [
        {
          ...suitabilityCriterionComplete,
          status: 'SUITABLE',
        },
      ],
      'ELIGIBLE',
      'SUITABLE',
      null,
      null,
      'SUITABLE',
    )

    await assessForEarlyRelease.stubSubmitCheckRequest(prisonNumber)
    await login(page, { authorities: ['ROLE_LICENCE_CA'], feComponentsFail: false })
    await page.goto(paths.prison.assessment.initialChecks.tasklist({ prisonNumber }))
    const suitabilityChecks = page.getByTestId('suitability-checks')
    expect(suitabilityChecks).toBeVisible()
    expect(suitabilityChecks).toContainText('Answer the first suitability question')
    expect(suitabilityChecks.locator('#suitability-check-1-hint')).toHaveText(
      'Recorded on 16 Jul 2025 by Rebecca Davidson',
    )
  })
})
