import { createInitialChecks } from '../../../data/__testutils/testObjects'
import { mockedDate, mockRequest, mockResponse } from '../../__testutils/requestTestUtils'
import createMockCaseAdminCaseloadService from '../../../services/__testutils/mock'
import TasklistRoutes from './tasklist'

const initialChecks = createInitialChecks({})

const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const req = mockRequest({})
const res = mockResponse({})

let tasklistRoutes: TasklistRoutes

beforeEach(() => {
  tasklistRoutes = new TasklistRoutes(caseAdminCaseloadService)
  caseAdminCaseloadService.getInitialChecks.mockResolvedValue(initialChecks)
  mockedDate(new Date(2022, 6, 1))
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render list of licences for approval', async () => {
    req.params.prisonNumber = initialChecks.assessmentSummary.prisonNumber
    await tasklistRoutes.GET(req, res)
    expect(caseAdminCaseloadService.getInitialChecks).toHaveBeenCalledWith(
      req.middleware.clientToken,
      req.params.prisonNumber,
    )
    expect(res.render).toHaveBeenCalledWith('pages/caseAdmin/initialChecks/tasklist', { initialChecks })
  })
})
