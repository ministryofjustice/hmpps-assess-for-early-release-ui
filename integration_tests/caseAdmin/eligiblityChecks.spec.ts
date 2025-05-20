import { expect, test } from '@playwright/test'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'
import { login, resetStubs } from '../testUtils'
import paths from '../../server/routes/paths'

import {
  assessmentSummary,
  eligibilityCriterion1,
  eligibilityCriterion1Completed,
  eligibilityCriterion2,
  eligibilityCriterion2Ineligible,
  suitabilityCriterion1,
} from '../mockApis/assessForEarlyReleaseData'

test.describe('Eligibility checks', () => {
  test.beforeEach(async () => {
    await resetStubs()
  })
  test('Case admin can complete initial checks', async ({ page }) => {
    const nextQuestionLinkText = 'Save and go to next question'
    const prisonNumber = 'A1234AE'

    const anAssessmentSummary = assessmentSummary(prisonNumber)
    await assessForEarlyRelease.stubGetEligibilityAndSuitability(
      anAssessmentSummary,
      [eligibilityCriterion1, eligibilityCriterion2],
      [suitabilityCriterion1],
    )
    await assessForEarlyRelease.stubSubmitCheckRequest(prisonNumber)

    await login(page, { authorities: ['ROLE_LICENCE_CA'], feComponentsFail: false })

    await page.goto(paths.prison.assessment.initialChecks.eligibilityAndSuitabilityQuestionList({ prisonNumber }))

    await expect(page.getByRole('heading', { name: 'Assess eligibility and suitability' })).toBeVisible()

    await assessForEarlyRelease.stubGetEligibilityCriterionView(
      anAssessmentSummary,
      eligibilityCriterion1,
      eligibilityCriterion2,
    )
    await expect(page.locator('id=suitability-check-1-status')).toHaveText('Cannot start yet')
    await page.getByRole('link', { name: 'Answer the first question' }).click()

    // answer question 1 for eligibility criterion 1 and check validation
    await expect(page.getByRole('heading', { name: 'Please answer question 1' })).toBeVisible()
    await page.getByText(nextQuestionLinkText).click()
    await expect(page.getByRole('heading', { name: 'There is a problem' })).toBeVisible()
    await page.getByRole('link', { name: 'Please answer question 1' }).click()
    await expect(page.locator('*:focus')).toHaveValue('true')
    await page.getByLabel('Yes').click()
    await assessForEarlyRelease.stubGetEligibilityCriterionView(anAssessmentSummary, eligibilityCriterion2, undefined)

    await assessForEarlyRelease.stubGetEligibilityAndSuitability(
      anAssessmentSummary,
      [
        {
          ...eligibilityCriterion1,
          status: 'ELIGIBLE',
        },
        {
          ...eligibilityCriterion2,
          status: 'ELIGIBLE',
        },
      ],
      [suitabilityCriterion1],
      'ELIGIBILITY_AND_SUITABILITY_IN_PROGRESS',
      'ELIGIBLE',
    )
    await page.getByText(nextQuestionLinkText).click()

    // answer 2 questions for eligibility criterion 2
    await page.getByRole('group', { name: 'Please answer question 2' }).getByLabel('Yes').click()
    await page.getByRole('group', { name: 'Please answer question 3' }).getByLabel('Yes').click()
    await page.getByText(nextQuestionLinkText).click()

    await expect(page.getByRole('heading', { name: 'Assess eligibility and suitability' })).toBeVisible()

    await assessForEarlyRelease.stubGetSuitabilityCriterionView(anAssessmentSummary, suitabilityCriterion1, undefined)
    await page.getByRole('link', { name: 'Answer the first suitability question' }).click()

    // answer 1 question for suitability criterion 1
    await expect(page.getByRole('heading', { name: 'Please answer question 4' })).toBeVisible()
    await page.getByRole('group', { name: 'Please answer question 4' }).getByLabel('Yes').click()
    await assessForEarlyRelease.stubSaveCriterionAnswers(
      anAssessmentSummary,
      [
        {
          ...eligibilityCriterion1,
          status: 'ELIGIBLE',
        },
        {
          ...eligibilityCriterion2,
          status: 'ELIGIBLE',
        },
      ],
      [
        {
          ...suitabilityCriterion1,
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
          ...eligibilityCriterion1,
          status: 'ELIGIBLE',
        },
        {
          ...eligibilityCriterion2,
          status: 'ELIGIBLE',
        },
      ],
      [
        {
          ...suitabilityCriterion1,
          status: 'SUITABLE',
        },
      ],
      'ELIGIBLE',
      'ELIGIBLE',
    )
    await page.getByText(nextQuestionLinkText).click()

    await expect(page.getByText('Eligibility and suitability checks complete')).toBeVisible()
    await expect(page.getByText('Kurn Uvarek is eligible and suitable for HDC')).toBeVisible()

    const submittedChecks = await assessForEarlyRelease.getSubmittedEligibilityChecks(anAssessmentSummary)
    expect(submittedChecks).toStrictEqual([
      {
        answers: {
          question1: true,
        },
        agent: {
          username: 'USER1',
          fullName: 'Katogh Kone',
          role: 'PRISON_CA',
          onBehalfOf: 'MDI',
        },
        code: 'code-1',
        type: 'eligibility',
      },
      {
        answers: {
          question2: true,
          question3: true,
        },
        agent: {
          username: 'USER1',
          fullName: 'Katogh Kone',
          role: 'PRISON_CA',
          onBehalfOf: 'MDI',
        },
        code: 'code-2',
        type: 'eligibility',
      },
      {
        answers: {
          question3: true,
        },
        agent: {
          username: 'USER1',
          fullName: 'Katogh Kone',
          role: 'PRISON_CA',
          onBehalfOf: 'MDI',
        },
        code: 'code-3',
        type: 'suitability',
      },
    ])

    await assessForEarlyRelease.stubGetEligibilityAndSuitability(
      anAssessmentSummary,
      [eligibilityCriterion1Completed, eligibilityCriterion2Ineligible],
      [suitabilityCriterion1],
      'INELIGIBLE',
      'INELIGIBLE',
      'INELIGIBLE',
      ['question-1'],
    )

    await page.goto(paths.prison.assessment.initialChecks.eligibilityAndSuitabilityQuestionList({ prisonNumber }))

    await expect(page.getByTestId('bannerHeading')).toContainText('Kurn Uvarek is ineligible for HDC')
    await expect(page.locator('#eligibility-check-1-status')).toContainText('Completed')
    await expect(page.locator('#eligibility-check-2-status')).toContainText('Ineligible')
    await expect(page.locator('#suitability-check-1-status')).toContainText('Cannot start yet')
    await expect(page.getByTestId('failureType')).toContainText('Ineligible')
    await expect(page.getByTestId('failureReasons')).toContainText('question-1')
    await expect(page.getByTestId('eligibility-checks')).toContainText(
      'Answer the first question Recorded on 16 Jul 2025 by Kahlest Kular',
    )
    await expect(page.getByTestId('eligibility-checks')).toContainText(
      'Answer the second 2 questions Recorded on 15 Jul 2025 by Kahlest Kular',
    )
    await expect(page.getByTestId('suitability-checks')).toContainText('Answer the first suitability question')
  })
})
