import { createCase } from '../../data/__testutils/testObjects'
import CaseloadRoutes from './caseload'
import { mockedDate, mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockCaseAdminCaseloadService } from '../../services/__testutils/mock'
import { parseIsoDate } from '../../utils/utils'
import paths from '../paths'
import AssessmentStatus from '../../enumeration/assessmentStatus'

const offenderSummaryList = [createCase({})]

const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const req = mockRequest({})
const res = mockResponse({
  locals: {
    activeCaseLoadId: 'MDI',
  },
})

let caseloadRoutes: CaseloadRoutes

beforeEach(() => {
  caseloadRoutes = new CaseloadRoutes(caseAdminCaseloadService)
  caseAdminCaseloadService.getCaseAdminCaseload.mockResolvedValue(offenderSummaryList)
  mockedDate(new Date(2022, 6, 1))
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render case admin caseload', async () => {
    await caseloadRoutes.GET(req, res)
    expect(caseAdminCaseloadService.getCaseAdminCaseload).toHaveBeenCalledWith(req.middleware.clientToken, 'MDI')
    expect(res.render).toHaveBeenCalledWith('pages/caseAdmin/caseload', {
      activeApplicationView: true,
      postponedCases: [],
      toWorkOnByYouCases: [
        {
          addressChecksComplete: false,
          createLink: paths.prison.assessment.home({ prisonNumber: offenderSummaryList[0].prisonNumber }),
          hdced: parseIsoDate('2022-01-08'),
          workingDaysToHdced: 1,
          name: 'Jim Smith',
          prisonNumber: 'A1234AB',
          probationPractitioner: 'Jane Huggins',
          isPostponed: false,
          status: 'ELIGIBILITY_AND_SUITABILITY_IN_PROGRESS',
        },
      ],
      withDecisionMakerCases: [],
      withProbationCases: [],
      inactiveApplications: [],
    })
  })

  it('should render inactive applications caseload', async () => {
    req.query = { view: 'inactive-applications' }
    const cases = [
      {
        ...offenderSummaryList[0],
        status: AssessmentStatus.REFUSED,
      },
    ]

    caseAdminCaseloadService.getCaseAdminCaseload.mockResolvedValue(cases)
    await caseloadRoutes.GET(req, res)
    expect(caseAdminCaseloadService.getCaseAdminCaseload).toHaveBeenCalledWith(req.middleware.clientToken, 'MDI')
    expect(res.render).toHaveBeenCalledWith('pages/caseAdmin/caseload', {
      activeApplicationView: false,
      postponedCases: [],
      toWorkOnByYouCases: [],
      withDecisionMakerCases: [],
      withProbationCases: [],
      inactiveApplications: [
        {
          addressChecksComplete: false,
          createLink: paths.prison.assessment.home({ prisonNumber: offenderSummaryList[0].prisonNumber }),
          hdced: parseIsoDate('2022-01-08'),
          workingDaysToHdced: 1,
          name: 'Jim Smith',
          prisonNumber: 'A1234AB',
          probationPractitioner: 'Jane Huggins',
          isPostponed: false,
          status: 'REFUSED',
        },
      ],
    })
  })

  it('should render with probation tab cases if status is AWAITING_ADDRESS_AND_RISK_CHECKS and addressChecksComplete is true ', async () => {
    req.query = { view: 'active-applications' }
    const cases = [
      {
        ...offenderSummaryList[0],
        status: AssessmentStatus.AWAITING_ADDRESS_AND_RISK_CHECKS,
        addressChecksComplete: true,
        isPostponed: false,
      },
    ]

    caseAdminCaseloadService.getCaseAdminCaseload.mockResolvedValue(cases)

    await caseloadRoutes.GET(req, res)

    expect(res.render).toHaveBeenCalledWith('pages/caseAdmin/caseload', {
      activeApplicationView: true,
      toWorkOnByYouCases: [],
      postponedCases: [],
      withDecisionMakerCases: [],
      withProbationCases: [
        {
          addressChecksComplete: true,
          createLink: paths.prison.assessment.home({ prisonNumber: offenderSummaryList[0].prisonNumber }),
          hdced: parseIsoDate('2022-01-08'),
          isPostponed: false,
          name: 'Jim Smith',
          prisonNumber: 'A1234AB',
          probationPractitioner: 'Jane Huggins',
          workingDaysToHdced: 1,
          status: 'AWAITING_ADDRESS_AND_RISK_CHECKS',
        },
      ],
      inactiveApplications: [],
    })
  })
})
