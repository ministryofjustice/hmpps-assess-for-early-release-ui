import { createAgent, createComCase } from '../../data/__testutils/testObjects'
import CaseloadRoutes from './caseload'
import { mockedDate, mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockCommunityOffenderManagerCaseloadService } from '../../services/__testutils/mock'
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
  it('should render active cases', async () => {
    const activeCase = createComCase({ status: AssessmentStatus.AWAITING_ADDRESS_AND_RISK_CHECKS })
    communityOffenderManagerCaseloadService.getCommunityOffenderManagerCaseload.mockResolvedValue([activeCase])

    await caseloadRoutes.GET(req, res)

    expect(communityOffenderManagerCaseloadService.getCommunityOffenderManagerCaseload).toHaveBeenCalledWith(
      req.middleware.clientToken,
      res.locals.agent,
      res.locals.user as ProbationUser,
    )
    expect(res.render).toHaveBeenCalledWith('pages/communityOffenderManager/caseload', {
      myCasesView: true,
      postponedCases: [],
      readyForReleaseCases: [],
      toWorkOnByYouCases: [
        {
          createLink: `/probation/assessment/${activeCase.prisonNumber}`,
          hdced: activeCase.hdced,
          name: activeCase.name,
          probationPractitioner: activeCase.probationPractitioner,
          prisonNumber: activeCase.prisonNumber,
          workingDaysToHdced: activeCase.workingDaysToHdced,
          status: activeCase.status,
          currentTask: activeCase.currentTask,
        },
      ],
      withPrisonAdminCases: [],
    })
  })

  it('should render inactive cases', async () => {
    const myCases = false
    req.query = { view: 'inactive-applications' }
    const inactiveCase = createComCase({ status: AssessmentStatus.REFUSED })
    const offenderSummaryList = [inactiveCase]
    communityOffenderManagerCaseloadService.getCommunityOffenderManagerCaseload.mockResolvedValue(offenderSummaryList)

    await caseloadRoutes.GET(req, res)

    expect(communityOffenderManagerCaseloadService.getCommunityOffenderManagerCaseload).toHaveBeenCalledWith(
      req.middleware.clientToken,
      res.locals.agent,
      res.locals.user as ProbationUser,
    )
    expect(res.render).toHaveBeenCalledWith('pages/communityOffenderManager/caseload', {
      myCasesView: myCases,
      inactiveApplications: [
        {
          createLink: `/probation/assessment/${inactiveCase.prisonNumber}`,
          hdced: inactiveCase.hdced,
          name: inactiveCase.name,
          probationPractitioner: inactiveCase.probationPractitioner,
          prisonNumber: inactiveCase.prisonNumber,
          workingDaysToHdced: inactiveCase.workingDaysToHdced,
          status: inactiveCase.status,
          currentTask: inactiveCase.currentTask,
        },
      ],
    })
  })
})
