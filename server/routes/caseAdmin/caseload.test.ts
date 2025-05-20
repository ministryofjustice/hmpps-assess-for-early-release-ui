import { createAgent, createCase } from '../../data/__testutils/testObjects'
import CaseloadRoutes from './caseload'
import { mockedDate, mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockCaseAdminCaseloadService } from '../../services/__testutils/mock'
import { parseIsoDate } from '../../utils/utils'
import paths from '../paths'
import AssessmentStatus from '../../enumeration/assessmentStatus'
import { Case } from '../../services/caseAdminCaseloadService'

const offenderSummaryList = [createCase({})]

const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const req = mockRequest({})
const res = mockResponse({
  locals: {
    activeCaseLoadId: 'MDI',
    agent: createAgent(),
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
    expect(caseAdminCaseloadService.getCaseAdminCaseload).toHaveBeenCalledWith(
      req.middleware.clientToken,
      res.locals.agent,
      'MDI',
    )
    expect(res.render).toHaveBeenCalledWith('pages/caseAdmin/caseload', {
      activeApplicationView: true,
      postponedCases: [],
      toWorkOnByYouCases: [
        {
          addressChecksComplete: false,
          createLink: paths.prison.assessment.home({ prisonNumber: offenderSummaryList[0].prisonNumber }),
          hdced: parseIsoDate('2022-01-08'),
          workingDaysToHdced: 1,
          name: 'Test Person',
          prisonNumber: 'A1234AB',
          probationPractitioner: 'Korth Gorkon',
          isPostponed: false,
          status: 'ELIGIBILITY_AND_SUITABILITY_IN_PROGRESS',
          taskOverdueOn: offenderSummaryList[0].taskOverdueOn,
          currentTask: 'Assess eligibility and suitability',
        },
      ],
      withDecisionMakerCases: [],
      withProbationCases: [],
      readyForReleaseCases: [],
      inactiveApplications: [],
    })
  })

  it('should render inactive applications caseload', async () => {
    req.query = { view: 'inactive-applications' }
    const cases: Case[] = [
      {
        ...offenderSummaryList[0],
        status: AssessmentStatus.REFUSED,
        currentTask: null,
      },
    ]

    caseAdminCaseloadService.getCaseAdminCaseload.mockResolvedValue(cases)
    await caseloadRoutes.GET(req, res)
    expect(caseAdminCaseloadService.getCaseAdminCaseload).toHaveBeenCalledWith(
      req.middleware.clientToken,
      res.locals.agent,
      'MDI',
    )
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
          name: 'Test Person',
          prisonNumber: 'A1234AB',
          probationPractitioner: 'Korth Gorkon',
          isPostponed: false,
          status: 'REFUSED',
          taskOverdueOn: offenderSummaryList[0].taskOverdueOn,
          currentTask: null,
        },
      ],
      readyForReleaseCases: [],
    })
  })

  it('should render with probation tab cases if status is AWAITING_ADDRESS_AND_RISK_CHECKS and addressChecksComplete is true ', async () => {
    req.query = { view: 'active-applications' }
    const cases = [
      {
        ...offenderSummaryList[0],
        status: AssessmentStatus.AWAITING_ADDRESS_AND_RISK_CHECKS,
        currentTask: 'CHECK_ADDRESSES_OR_COMMUNITY_ACCOMMODATION',
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
          name: 'Test Person',
          prisonNumber: 'A1234AB',
          probationPractitioner: 'Korth Gorkon',
          workingDaysToHdced: 1,
          status: 'AWAITING_ADDRESS_AND_RISK_CHECKS',
          taskOverdueOn: offenderSummaryList[0].taskOverdueOn,
          currentTask: 'Check addresses or community accommodation',
        },
      ],
      inactiveApplications: [],
      readyForReleaseCases: [],
    })
  })
})
