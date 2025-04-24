import { createAgent, createAssessmentOverviewSummary } from '../../data/__testutils/testObjects'
import { mockedDate, mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockCaseAdminCaseloadService } from '../../services/__testutils/mock'
import AssessmentRoutes from './assessment'
import { contactResponse } from '../../../integration_tests/mockApis/assessForEarlyReleaseData'

const assessmentOverviewSummary = createAssessmentOverviewSummary({})
const probationCom = contactResponse(null, 'PROBATION_COM', null, null)
const prisonDm = contactResponse(null, 'PRISON_DM', null, null)
const prisonCa = contactResponse(null, 'PRISON_CA', null, null)

const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const req = mockRequest({})
const res = mockResponse({})
res.locals.agent = createAgent()

let assessmentRoutes: AssessmentRoutes

beforeEach(() => {
  assessmentRoutes = new AssessmentRoutes(caseAdminCaseloadService)
  caseAdminCaseloadService.getAssessmentOverviewSummary.mockResolvedValue(assessmentOverviewSummary)
  mockedDate(new Date(2022, 6, 1))
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render list of licences for approval', async () => {
    req.params.prisonNumber = assessmentOverviewSummary.prisonNumber
    await assessmentRoutes.GET(req, res)
    expect(caseAdminCaseloadService.getAssessmentOverviewSummary).toHaveBeenCalledWith(
      req.middleware.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )
    expect(res.render).toHaveBeenCalledWith('pages/caseAdmin/assessment', {
      assessmentSummary: {
        ...assessmentOverviewSummary,
        contactList: [prisonCa, probationCom, prisonDm],
        tasks: assessmentOverviewSummary.tasks.PRISON_CA,
        formsToShow: [],
      },
    })
  })
})
