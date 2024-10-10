import { convertToTitleCase } from '../../utils/utils'
import paths from '../paths'

import { createAssessmentSummary } from '../../data/__testutils/testObjects'
import { mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockCaseAdminCaseloadService } from '../../services/__testutils/mock'
import NoAddressFoundRoutes from './noAddressFound'

const assessmentSummary = createAssessmentSummary({})

const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const req = mockRequest({})
const res = mockResponse({})

let noAddressFoundRoutes: NoAddressFoundRoutes

beforeEach(() => {
  noAddressFoundRoutes = new NoAddressFoundRoutes(caseAdminCaseloadService)
  caseAdminCaseloadService.getAssessmentSummary.mockResolvedValue(assessmentSummary)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render find address page', async () => {
    req.params.prisonNumber = assessmentSummary.prisonNumber
    req.params.postcode = 'BA129FU'
    await noAddressFoundRoutes.GET(req, res)

    expect(caseAdminCaseloadService.getAssessmentSummary).toHaveBeenCalledWith(
      req.middleware.clientToken,
      req.params.prisonNumber,
    )
    expect(res.render).toHaveBeenCalledWith('pages/curfewAddress/noAddressFound', {
      assessmentSummary: {
        ...assessmentSummary,
        name: convertToTitleCase(`${assessmentSummary.forename} ${assessmentSummary.surname}`.trim()),
      },
      postcode: req.params.postcode,
      findAddressUrl: paths.prison.assessment.curfewAddress.findAddress({ prisonNumber: req.params.prisonNumber }),
    })
  })
})
