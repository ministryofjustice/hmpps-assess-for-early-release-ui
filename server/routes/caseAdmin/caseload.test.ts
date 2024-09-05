import createMockCaseAdminCaseloadService from '../../services/testutils/mock'
import { createOffenderSummary, caseAdminCaseload } from '../../data/testutils/testObjects'
import CaseloadRoutes from './caseload'
import { mockedDate, mockRequest, mockResponse } from '../testutils/requestTestUtils'

const offenderSummaryList = [createOffenderSummary({})]
const caseAdminCaseloadList = [caseAdminCaseload({})]

const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const req = mockRequest({})
const res = mockResponse({})

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
  it('should render list of licences for approval', async () => {
    await caseloadRoutes.GET(req, res)
    expect(caseAdminCaseloadService.getCaseAdminCaseload).toHaveBeenCalledWith(req.middleware.clientToken, 'MDI')
    expect(res.render).toHaveBeenCalledWith('pages/caseAdmin/caseload', { caseload: caseAdminCaseloadList })
  })
})
