import { CaseAdminCaseloadService } from '.'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createAssessmentSummary, createOffenderSummary } from '../data/__testutils/testObjects'
import { mockRequest } from '../routes/__testutils/requestTestUtils'

const offenderSummaryList = [createOffenderSummary({})]
const assessmentSummaryList = [createAssessmentSummary({})]

const AssessForEarlyReleaseApiClientBuilder = jest.fn()
const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const req = mockRequest({})

let caseAdminCaseloadService: CaseAdminCaseloadService

beforeEach(() => {
  AssessForEarlyReleaseApiClientBuilder.mockReturnValue(assessForEarlyReleaseApiClient)
  caseAdminCaseloadService = new CaseAdminCaseloadService(AssessForEarlyReleaseApiClientBuilder)
  assessForEarlyReleaseApiClient.getCaseAdminCaseload.mockResolvedValue(offenderSummaryList)
  assessForEarlyReleaseApiClient.getAssessmentSummary.mockResolvedValue(assessmentSummaryList)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('COM Caseload Service', () => {
  it('get caseadmin caseload', async () => {
    const result = await caseAdminCaseloadService.getCaseAdminCaseload(req.middleware.clientToken, 'MDI')
    expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(req.middleware.clientToken)
    expect(result).toEqual(offenderSummaryList)
  })
})

describe('Assessment Summary', () => {
  it('get assessment summary', async () => {
    req.params.prisonNumber = assessmentSummaryList[0].prisonNumber
    const result = await caseAdminCaseloadService.getAssessmentSummary(
      req.middleware.clientToken,
      req.params.prisonNumber,
    )
    expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(req.middleware.clientToken)
    expect(result).toEqual(assessmentSummaryList)
  })
})
