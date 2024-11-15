import { CaseAdminCaseloadService } from '.'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createAssessmentSummary, createOffenderSummary } from '../data/__testutils/testObjects'

const AssessForEarlyReleaseApiClientBuilder = jest.fn()
const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'

describe('CA Caseload Service', () => {
  let caseAdminCaseloadService: CaseAdminCaseloadService

  beforeEach(() => {
    AssessForEarlyReleaseApiClientBuilder.mockReturnValue(assessForEarlyReleaseApiClient)
    caseAdminCaseloadService = new CaseAdminCaseloadService(AssessForEarlyReleaseApiClientBuilder)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Caseload', () => {
    it('get caseadmin caseload', async () => {
      const aCase = createOffenderSummary({})
      assessForEarlyReleaseApiClient.getCaseAdminCaseload.mockResolvedValue([aCase])

      const result = await caseAdminCaseloadService.getCaseAdminCaseload(token, 'MDI')

      expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
      expect(result).toEqual([
        {
          name: 'Jim Smith',
          remainingDays: 3,
          prisonNumber: 'A1234AB',
          hdced: aCase.hdced,
        },
      ])
    })
  })

  describe('Assessment Summary', () => {
    const assessmentSummary = createAssessmentSummary({})

    it('get assessment summary', async () => {
      assessForEarlyReleaseApiClient.getAssessmentSummary.mockResolvedValue(assessmentSummary)

      const result = await caseAdminCaseloadService.getAssessmentSummary(token, assessmentSummary.prisonNumber)

      expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
      expect(result).toEqual(assessmentSummary)
    })
  })
})
