import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createOffenderSummary } from '../data/__testutils/testObjects'
import DecisionMakerCaseloadService from './decisionMakerCaseloadService'

const AssessForEarlyReleaseApiClientBuilder = jest.fn()
const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'

describe('Decision maker Caseload Service', () => {
  let decisionMakerCaseloadService: DecisionMakerCaseloadService

  beforeEach(() => {
    AssessForEarlyReleaseApiClientBuilder.mockReturnValue(assessForEarlyReleaseApiClient)
    decisionMakerCaseloadService = new DecisionMakerCaseloadService(AssessForEarlyReleaseApiClientBuilder)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Caseload', () => {
    it('get decision maker caseload', async () => {
      const aCase = createOffenderSummary({})
      assessForEarlyReleaseApiClient.getDecisionMakerCaseload.mockResolvedValue([aCase])

      const result = await decisionMakerCaseloadService.getDecisionMakerCaseload(token, 'MDI')

      expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
      expect(result).toEqual([
        {
          name: 'Jim Smith',
          prisonNumber: 'A1234AB',
          hdced: aCase.hdced,
          remainingDays: 3,
        },
      ])
    })
  })
})
