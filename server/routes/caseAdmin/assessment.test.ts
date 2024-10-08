import { createAssessmentSummary } from '../../data/__testutils/testObjects'
import { mockedDate, mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockCaseAdminCaseloadService } from '../../services/__testutils/mock'
import AssessmentRoutes from './assessment'
import { convertToTitleCase } from '../../utils/utils'
import paths from '../paths'

const assessmentSummary = createAssessmentSummary({})

const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const req = mockRequest({})
const res = mockResponse({})

let assessmentRoutes: AssessmentRoutes

beforeEach(() => {
  assessmentRoutes = new AssessmentRoutes(caseAdminCaseloadService)
  caseAdminCaseloadService.getAssessmentSummary.mockResolvedValue(assessmentSummary)
  mockedDate(new Date(2022, 6, 1))
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render list of licences for approval', async () => {
    req.params.prisonNumber = assessmentSummary.prisonNumber
    await assessmentRoutes.GET(req, res)
    expect(caseAdminCaseloadService.getAssessmentSummary).toHaveBeenCalledWith(
      req.middleware.clientToken,
      req.params.prisonNumber,
    )
    expect(res.render).toHaveBeenCalledWith('pages/caseAdmin/assessment', {
      assessmentSummary: {
        ...assessmentSummary,
        name: convertToTitleCase(`${assessmentSummary.forename} ${assessmentSummary.surname}`.trim()),
      },
      optOutLink: paths.prison.assessment.optOutCheck({
        prisonNumber: assessmentSummary.prisonNumber,
      }),
    })
  })
})
