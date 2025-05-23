import {
  createAssessmentSummary,
  createResidentialChecksView,
  createStandardAddressCheckRequestSummary,
} from '../../../data/__testutils/testObjects'
import { mockRequest, mockResponse } from '../../__testutils/requestTestUtils'
import ResidentialChecksTasklistRoutes from './tasklist'
import { createMockAddressService, createMockResidentialChecksService } from '../../../services/__testutils/mock'

const assessmentSummary = createAssessmentSummary({})
const addressCheckRequest = createStandardAddressCheckRequestSummary()
const residentialChecksView = createResidentialChecksView()

const addressService = createMockAddressService()
const residentialChecksService = createMockResidentialChecksService()

const req = mockRequest({})
const res = mockResponse({})
res.locals.agent = { role: 'PROBATION_COM' }

let residentialChecksTaskListRoutes: ResidentialChecksTasklistRoutes

beforeEach(() => {
  residentialChecksTaskListRoutes = new ResidentialChecksTasklistRoutes(addressService, residentialChecksService)
  addressService.getStandardAddressCheckRequest.mockResolvedValue(addressCheckRequest)
  residentialChecksService.getResidentialChecksView.mockResolvedValue(residentialChecksView)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render list of residential checks tasks', async () => {
    req.params.prisonNumber = assessmentSummary.prisonNumber
    req.params.checkRequestId = addressCheckRequest.requestId.toString()

    await residentialChecksTaskListRoutes.GET(req, res)

    expect(addressService.getStandardAddressCheckRequest).toHaveBeenCalledWith(
      req.middleware.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
      Number(req.params.checkRequestId),
    )

    expect(addressService.getStandardAddressCheckRequest).toHaveBeenCalledWith(
      req.middleware.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
      Number(req.params.checkRequestId),
    )

    expect(res.render).toHaveBeenCalledWith('pages/communityOffenderManager/residentialChecks/tasklist', {
      prisonNumber: req.params.prisonNumber,
      addressCheckRequest,
      residentialChecksView,
    })
  })
})
