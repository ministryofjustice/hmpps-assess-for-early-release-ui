import { createAgent, createComCase } from '../../data/__testutils/testObjects'
import CaseloadRoutes from './caseload'
import { mockedDate, mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockCommunityOffenderManagerCaseloadService } from '../../services/__testutils/mock'
import { parseIsoDate } from '../../utils/utils'
import { ProbationUser } from '../../interfaces/hmppsUser'
import AssessmentStatus from '../../enumeration/assessmentStatus'

const communityOffenderManagerCaseloadService = createMockCommunityOffenderManagerCaseloadService()
const req = mockRequest({})
const res = mockResponse({
  locals: {
    user: {
      deliusStaffIdentifier: 1,
    },
    agent: createAgent({ role: 'PROBATION_COM' }),
  },
})

let caseloadRoutes: CaseloadRoutes

beforeEach(() => {
  caseloadRoutes = new CaseloadRoutes(communityOffenderManagerCaseloadService)
  mockedDate(new Date(2022, 6, 1))
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render inactive cases', async () => {
    const activeApplicationView = false
    req.query = { view: 'inactive-applications' }
    const offenderSummaryList = [createComCase({ status: AssessmentStatus.REFUSED })]
    communityOffenderManagerCaseloadService.getCommunityOffenderManagerCaseload.mockResolvedValue(offenderSummaryList)

    await caseloadRoutes.GET(req, res)

    expect(communityOffenderManagerCaseloadService.getCommunityOffenderManagerCaseload).toHaveBeenCalledWith(
      req.middleware.clientToken,
      res.locals.agent,
      res.locals.user as ProbationUser,
    )
    expect(res.render).toHaveBeenCalledWith('pages/communityOffenderManager/caseload', {
      activeApplicationView,
      caseload: [],
      inactiveApplications: [
        {
          createLink: '/probation/assessment/A1234AB',
          hdced: parseIsoDate('2022-01-08'),
          name: 'Jim Smith',
          probationPractitioner: 'CVl_COM',
          prisonNumber: 'A1234AB',
          workingDaysToHdced: 1,
          status: 'REFUSED',
          currentTask: null,
        },
      ],
    })
  })
})
