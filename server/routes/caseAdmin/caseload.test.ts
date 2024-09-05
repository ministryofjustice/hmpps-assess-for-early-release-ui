import createMockCaseAdminCaseloadService from '../../services/testUtils/mock'
import { createOffenderSummary, caseAdminCaseload } from '../../data/testutils/testObjects'
import CaseloadRoutes from './caseload'
import { mockedDate, mockRequest, mockResponse } from '../testutils/requestTestUtils'

const offenderSummaryList = [createOffenderSummary({})]
const caseAdminCaseloadList = [caseAdminCaseload({})]

const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const handler = new CaseloadRoutes(caseAdminCaseloadService)
const req = mockRequest({})
const res = mockResponse({})

beforeEach(() => {
  caseAdminCaseloadService.getCaseAdminCaseload.mockResolvedValue(offenderSummaryList)
  mockedDate(new Date(2022, 6, 1))
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render list of licences for approval', async () => {
    await handler.GET(req, res)
    expect(caseAdminCaseloadService.getCaseAdminCaseload).toHaveBeenCalledWith(req.middleware.clientToken, 'MDI')
    expect(res.render).toHaveBeenCalledWith('pages/caseAdmin/caseload', { caseload: caseAdminCaseloadList })
  })
})
