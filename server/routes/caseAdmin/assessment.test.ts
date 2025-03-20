import { createAgent, createAssessmentOverviewSummary } from '../../data/__testutils/testObjects'
import { mockedDate, mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockCaseAdminCaseloadService } from '../../services/__testutils/mock'
import AssessmentRoutes from './assessment'
import AssessmentStatus from '../../enumeration/assessmentStatus'

const assessmentOverviewSummary = createAssessmentOverviewSummary({})

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
        tasks: assessmentOverviewSummary.tasks.PRISON_CA,
        formsToShow: [],
      },
    })
  })

  it('should render list of forms for ELIGIBLE_AND_SUITABLE document type', async () => {
    const assessmentSummary = createAssessmentOverviewSummary({
      status: AssessmentStatus.ELIGIBLE_AND_SUITABLE,
    })
    caseAdminCaseloadService.getAssessmentOverviewSummary.mockResolvedValue(assessmentSummary)
    req.params.prisonNumber = assessmentOverviewSummary.prisonNumber
    await assessmentRoutes.GET(req, res)
    expect(caseAdminCaseloadService.getAssessmentOverviewSummary).toHaveBeenCalledWith(
      req.middleware.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )
    expect(res.render).toHaveBeenCalledWith('pages/caseAdmin/assessment', {
      assessmentSummary: {
        ...assessmentSummary,
        tasks: assessmentOverviewSummary.tasks.PRISON_CA,
        formsToShow: [
          {
            link: '/offender/A1234AB/document/OFFENDER_ELIGIBLE_FORM',
            text: 'Eligible',
          },
          {
            link: '/offender/A1234AB/document/OFFENDER_ADDRESS_CHECKS_INFORMATION_FORM',
            text: 'Information about address checks',
          },
          {
            link: '/offender/A1234AB/document/OFFENDER_ADDRESS_CHECKS_FORM',
            text: 'Address checks',
          },
          {
            link: '/offender/A1234AB/document/OFFENDER_OPT_OUT_FORM',
            text: 'Opt out',
          },
        ],
      },
    })
  })

  it('should render list of forms for POSTPONED document type', async () => {
    const assessmentSummary = createAssessmentOverviewSummary({
      status: AssessmentStatus.POSTPONED,
    })
    caseAdminCaseloadService.getAssessmentOverviewSummary.mockResolvedValue(assessmentSummary)
    req.params.prisonNumber = assessmentOverviewSummary.prisonNumber
    await assessmentRoutes.GET(req, res)
    expect(caseAdminCaseloadService.getAssessmentOverviewSummary).toHaveBeenCalledWith(
      req.middleware.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )
    expect(res.render).toHaveBeenCalledWith('pages/caseAdmin/assessment', {
      assessmentSummary: {
        ...assessmentSummary,
        tasks: assessmentOverviewSummary.tasks.PRISON_CA,
        formsToShow: [
          {
            link: '/offender/A1234AB/document/OFFENDER_ELIGIBLE_FORM',
            text: 'Eligible',
          },
          {
            link: '/offender/A1234AB/document/OFFENDER_ADDRESS_CHECKS_INFORMATION_FORM',
            text: 'Information about address checks',
          },
          {
            link: '/offender/A1234AB/document/OFFENDER_ADDRESS_CHECKS_FORM',
            text: 'Address checks',
          },
          {
            link: '/offender/A1234AB/document/OFFENDER_OPT_OUT_FORM',
            text: 'Opt out',
          },
          {
            link: '/offender/A1234AB/document/OFFENDER_ADDRESS_UNSUITABLE_FORM',
            text: 'Address unsuitable',
          },
          {
            link: '/offender/A1234AB/document/OFFENDER_POSTPONED_FORM',
            text: 'Postponed',
          },
        ],
      },
    })
  })
})
