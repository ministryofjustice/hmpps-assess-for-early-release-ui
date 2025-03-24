import { Agent } from '../@types/assessForEarlyReleaseApiClientTypes'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createAgent, createAssessmentOverviewSummary, createOffenderSummary } from '../data/__testutils/testObjects'
import DecisionMakerCaseloadService from './decisionMakerCaseloadService'

const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'
const agent = createAgent() as Agent

describe('Decision maker Caseload Service', () => {
  let decisionMakerCaseloadService: DecisionMakerCaseloadService

  beforeEach(() => {
    decisionMakerCaseloadService = new DecisionMakerCaseloadService(assessForEarlyReleaseApiClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Caseload', () => {
    it('get decision maker caseload', async () => {
      const aCase = createOffenderSummary({})
      assessForEarlyReleaseApiClient.getDecisionMakerCaseload.mockResolvedValue([aCase])

      const result = await decisionMakerCaseloadService.getDecisionMakerCaseload(token, agent, 'MDI')

      expect(result).toEqual([
        {
          name: 'Jim Smith',
          prisonNumber: 'A1234AB',
          hdced: aCase.hdced,
          workingDaysToHdced: 3,
        },
      ])
    })
  })

  describe('Assessment Summary', () => {
    const assessmentOveriewSummary = createAssessmentOverviewSummary({})

    it('get assessment summary', async () => {
      assessForEarlyReleaseApiClient.getAssessmentOverviewSummary.mockResolvedValue(assessmentOveriewSummary)

      const result = await decisionMakerCaseloadService.getAssessmentOverviewSummary(
        token,
        agent,
        assessmentOveriewSummary.prisonNumber,
      )

      expect(result).toEqual(assessmentOveriewSummary)
    })
  })
})
