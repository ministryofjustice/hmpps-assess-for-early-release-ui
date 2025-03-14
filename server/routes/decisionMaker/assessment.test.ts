import { createAssessmentOverviewSummary } from '../../data/__testutils/testObjects'
import { mockedDate, mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockDecisionMakerCaseloadService } from '../../services/__testutils/mock'
import AssessmentRoutes from './assessment'

const assessmentOverviewSummary = createAssessmentOverviewSummary({})

const caseloadService = createMockDecisionMakerCaseloadService()
const req = mockRequest({})
const res = mockResponse({})
res.locals.agent = { role: 'PRISON_DM' }

let assessmentRoutes: AssessmentRoutes

beforeEach(() => {
  assessmentRoutes = new AssessmentRoutes(caseloadService)
  caseloadService.getAssessmentOverviewSummary.mockResolvedValue(assessmentOverviewSummary)
  mockedDate(new Date(2022, 6, 1))
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render list of licences for approval', async () => {
    req.params.prisonNumber = assessmentOverviewSummary.prisonNumber
    await assessmentRoutes.GET(req, res)
    expect(caseloadService.getAssessmentOverviewSummary).toHaveBeenCalledWith(
      req.middleware.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )
    expect(res.render).toHaveBeenCalledWith('pages/decisionMaker/assessment', {
      assessmentSummary: { ...assessmentOverviewSummary, tasks: assessmentOverviewSummary.tasks.PRISON_DM },
    })
  })
})
