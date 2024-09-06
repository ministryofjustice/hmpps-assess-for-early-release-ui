import { CaseAdminCaseloadService } from '.'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createOffenderSummary } from '../data/__testutils/testObjects'
import { mockRequest } from '../routes/__testutils/requestTestUtils'

const offenderSummaryList = [createOffenderSummary({})]

const AssessForEarlyReleaseApiClientBuilder = jest.fn()
const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const req = mockRequest({})

let caseAdminCaseloadService: CaseAdminCaseloadService

beforeEach(() => {
  AssessForEarlyReleaseApiClientBuilder.mockReturnValue(assessForEarlyReleaseApiClient)
  caseAdminCaseloadService = new CaseAdminCaseloadService(AssessForEarlyReleaseApiClientBuilder)
  assessForEarlyReleaseApiClient.getCaseAdminCaseload.mockResolvedValue(offenderSummaryList)
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
