import { createCase } from '../../data/__testutils/testObjects'
import CaseloadRoutes from './caseload'
import { mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockDecisionMakerCaseloadService } from '../../services/__testutils/mock'
import { parseIsoDate } from '../../utils/utils'

const offenderSummaryList = [createCase({})]

const decisionMakerCaseloadService = createMockDecisionMakerCaseloadService()
const req = mockRequest({})
const res = mockResponse({})
res.locals.agent = { role: 'PRISON_DM' }

let caseloadRoutes: CaseloadRoutes

beforeEach(() => {
  caseloadRoutes = new CaseloadRoutes(decisionMakerCaseloadService)
  decisionMakerCaseloadService.getDecisionMakerCaseload.mockResolvedValue(offenderSummaryList)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render list of licences for approval', async () => {
    await caseloadRoutes.GET(req, res)
    expect(decisionMakerCaseloadService.getDecisionMakerCaseload).toHaveBeenCalledWith(
      req.middleware.clientToken,
      res.locals.agent,
      'MDI',
    )
    expect(res.render).toHaveBeenCalledWith('pages/decisionMaker/caseload', {
      caseload: [
        {
          createLink: '/decisionMaker/assessment/A1234AB',
          hdced: parseIsoDate('2022-01-08'),
          workingDaysToHdced: 1,
          name: 'Test Person',
          prisonNumber: 'A1234AB',
        },
      ],
    })
  })
})
