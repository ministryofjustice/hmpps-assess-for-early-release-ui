import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import {
  createEligibilityAndSuitabilityCaseView,
  createEligibilityCriterionProgress,
  createSuitabilityCriterionProgress,
  createEligibilityCriterionView,
  createSuitabilityCriterionView,
  createQuestion,
} from '../data/__testutils/testObjects'
import EligibilityAndSuitabilityService from './eligibilityAndSuitabilityService'
import { Agent } from '../@types/assessForEarlyReleaseApiClientTypes'

const AssessForEarlyReleaseApiClientBuilder = jest.fn()
const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'
const agent: Agent = {
  username: 'prisonUser',
  fullName: 'Prison User',
  role: 'PRISON_CA',
  onBehalfOf: 'JWO',
}

describe('EligibilityAndSuitabilityService', () => {
  let eligibilityAndSuitabilityService: EligibilityAndSuitabilityService

  beforeEach(() => {
    AssessForEarlyReleaseApiClientBuilder.mockReturnValue(assessForEarlyReleaseApiClient)
    eligibilityAndSuitabilityService = new EligibilityAndSuitabilityService(AssessForEarlyReleaseApiClientBuilder)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('EligibilityService', () => {
    it('get Criteria', async () => {
      const eligibilityCheck1 = createEligibilityCriterionProgress({ code: 'eligibility-1' })
      const eligibilityCheck2 = createEligibilityCriterionProgress({ code: 'eligibility-2' })
      const suitabilityCheck1 = createSuitabilityCriterionProgress({ code: 'suitability-1' })
      const suitabilityCheck2 = createSuitabilityCriterionProgress({ code: 'suitability-1' })

      const view = createEligibilityAndSuitabilityCaseView({
        eligibility: [eligibilityCheck1, eligibilityCheck2],
        suitability: [suitabilityCheck1, suitabilityCheck2],
      })

      assessForEarlyReleaseApiClient.getEligibilityCriteriaView.mockResolvedValue(view)

      const result = await eligibilityAndSuitabilityService.getCriteria(token, view.assessmentSummary.prisonNumber)

      expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
      expect(result).toEqual(result)
    })

    describe('getCriterion', () => {
      it('get Eligibility Criterion view', async () => {
        const criterionView = createEligibilityCriterionView({})

        assessForEarlyReleaseApiClient.getEligibilityCriterionView.mockResolvedValue(criterionView)

        const result = await eligibilityAndSuitabilityService.getCriterion(
          token,
          criterionView.assessmentSummary.prisonNumber,
          'eligibility-check',
          criterionView.criterion.code,
        )

        expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
        expect(assessForEarlyReleaseApiClient.getEligibilityCriterionView).toHaveBeenCalledWith(
          criterionView.assessmentSummary.prisonNumber,
          criterionView.criterion.code,
        )

        expect(result).toStrictEqual(criterionView)
      })

      it('get Suitability Criterion view', async () => {
        const criterionView = createSuitabilityCriterionView({})

        assessForEarlyReleaseApiClient.getSuitabilityCriterionView.mockResolvedValue(criterionView)

        const result = await eligibilityAndSuitabilityService.getCriterion(
          token,
          criterionView.assessmentSummary.prisonNumber,
          'suitability-check',
          criterionView.criterion.code,
        )

        expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
        expect(assessForEarlyReleaseApiClient.getSuitabilityCriterionView).toHaveBeenCalledWith(
          criterionView.assessmentSummary.prisonNumber,
          criterionView.criterion.code,
        )

        expect(result).toStrictEqual(criterionView)
      })
    })

    describe('saveCriteriaCheck', () => {
      it('save criteria check with true answer', async () => {
        const criterionProgress = createEligibilityCriterionProgress({})

        await eligibilityAndSuitabilityService.saveCriterionAnswers(token, {
          prisonNumber: 'A1234AA',
          agent,
          type: 'eligibility',
          criterion: criterionProgress,
          form: { question1: 'true' },
        })

        expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
        expect(assessForEarlyReleaseApiClient.submitAnswer).toHaveBeenCalledWith('A1234AA', {
          answers: {
            question1: true,
          },
          agent,
          code: 'code-1',
          type: 'eligibility',
        })
      })

      it('save criteria check with false answer', async () => {
        const criterionProgress = createEligibilityCriterionProgress({})

        await eligibilityAndSuitabilityService.saveCriterionAnswers(token, {
          prisonNumber: 'A1234AA',
          agent,
          type: 'eligibility',
          criterion: criterionProgress,
          form: { question1: 'false' },
        })

        expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
        expect(assessForEarlyReleaseApiClient.submitAnswer).toHaveBeenCalledWith('A1234AA', {
          answers: {
            question1: false,
          },
          agent,
          code: 'code-1',
          type: 'eligibility',
        })
      })

      it('save criteria check with multiple answers', async () => {
        const criterionProgress = createEligibilityCriterionProgress({
          questions: [
            createQuestion({ name: 'name1' }),
            createQuestion({ name: 'name2' }),
            createQuestion({ name: 'name3' }),
          ],
        })

        await eligibilityAndSuitabilityService.saveCriterionAnswers(token, {
          prisonNumber: 'A1234AA',
          agent,
          type: 'eligibility',
          criterion: criterionProgress,
          form: { name1: 'false', name2: 'true', name3: 'true' },
        })

        expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
        expect(assessForEarlyReleaseApiClient.submitAnswer).toHaveBeenCalledWith('A1234AA', {
          answers: {
            name1: false,
            name2: true,
            name3: true,
          },
          agent,
          code: 'code-1',
          type: 'eligibility',
        })
      })
    })
  })
})
