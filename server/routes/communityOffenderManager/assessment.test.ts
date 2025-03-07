import { createAssessmentSummary } from '../../data/__testutils/testObjects'
import { mockedDate, mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockCommunityOffenderManagerCaseloadService } from '../../services/__testutils/mock'
import AssessmentRoutes from './assessment'

const assessmentSummary = createAssessmentSummary({})

const caseloadService = createMockCommunityOffenderManagerCaseloadService()
const req = mockRequest({})
const res = mockResponse({})

let assessmentRoutes: AssessmentRoutes

beforeEach(() => {
  assessmentRoutes = new AssessmentRoutes(caseloadService)
  caseloadService.getAssessmentSummary.mockResolvedValue(assessmentSummary)
  mockedDate(new Date(2022, 6, 1))
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render list of licences for approval', async () => {
    req.params.prisonNumber = assessmentSummary.prisonNumber
    await assessmentRoutes.GET(req, res)
    expect(caseloadService.getAssessmentSummary).toHaveBeenCalledWith(
      req.middleware.clientToken,
      {},
      req.params.prisonNumber,
    )
    expect(res.render).toHaveBeenCalledWith('pages/communityOffenderManager/assessment', {
      assessmentSummary: { ...assessmentSummary, tasks: assessmentSummary.tasks.PROBATION_COM },
    })
  })
})
