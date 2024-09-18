import { CaseAdminCaseloadService } from '.'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createAssessmentSummary, createOffenderSummary, createInitialChecks } from '../data/__testutils/testObjects'

const AssessForEarlyReleaseApiClientBuilder = jest.fn()
const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'

describe('COM Caseload Service', () => {
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
      const offenderSummaryList = [createOffenderSummary({})]
      assessForEarlyReleaseApiClient.getCaseAdminCaseload.mockResolvedValue(offenderSummaryList)

      const result = await caseAdminCaseloadService.getCaseAdminCaseload(token, 'MDI')

      expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
      expect(result).toEqual(offenderSummaryList)
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
  describe('Initial checks', () => {
    const initialChecks = createInitialChecks({})

    it('get initial checks', async () => {
      assessForEarlyReleaseApiClient.getInitialCheckStatus.mockResolvedValue(initialChecks)

      const result = await caseAdminCaseloadService.getInitialChecks(
        token,
        initialChecks.assessmentSummary.prisonNumber,
      )

      expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
      expect(result).toEqual(result)
    })
  })
})
