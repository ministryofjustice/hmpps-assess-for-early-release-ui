import { createCase } from '../../data/__testutils/testObjects'
import CaseloadRoutes from './caseload'
import { mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockDecisionMakerCaseloadService } from '../../services/__testutils/mock'
import { parseIsoDate } from '../../utils/utils'

const offenderSummaryList = [createCase({})]

const decisionMakerCaseloadService = createMockDecisionMakerCaseloadService()
const req = mockRequest({})
const res = mockResponse({})

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
      'MDI',
    )
    expect(res.render).toHaveBeenCalledWith('pages/decisionMaker/caseload', {
      caseload: [
        {
          createLink: '/decisionMaker/assessment/A1234AB',
          hdced: parseIsoDate('2022-01-08'),
          name: 'Jim Smith',
          prisonNumber: 'A1234AB',
          remainingDays: 1,
        },
      ],
    })
  })
})
