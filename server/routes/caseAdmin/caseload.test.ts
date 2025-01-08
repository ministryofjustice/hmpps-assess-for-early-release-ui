import { createCase } from '../../data/__testutils/testObjects'
import CaseloadRoutes from './caseload'
import { mockedDate, mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockCaseAdminCaseloadService } from '../../services/__testutils/mock'
import { parseIsoDate } from '../../utils/utils'
import paths from '../paths'

const offenderSummaryList = [createCase({})]

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
    expect(res.render).toHaveBeenCalledWith('pages/caseAdmin/caseload', {
      caseload: [
        {
          createLink: paths.prison.assessment.home({ prisonNumber: offenderSummaryList[0].prisonNumber }),
          hdced: parseIsoDate('2022-01-08'),
          name: 'Jim Smith',
          prisonNumber: 'A1234AB',
          remainingDays: 1,
        },
      ],
    })
  })
})
