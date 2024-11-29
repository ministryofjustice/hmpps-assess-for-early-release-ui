import {
  createAssessmentSummary,
  createResidentialChecksView,
  createStandardAddressCheckRequestSummary,
} from '../../../data/__testutils/testObjects'
import { mockRequest, mockResponse } from '../../__testutils/requestTestUtils'
import ResidentialChecksTasklistRoutes from './tasklist'
import { createMockAddressService, createMockResidentialChecksService } from '../../../services/__testutils/mock'

const assessmentSummary = createAssessmentSummary({})
const addressCheckSummary = createStandardAddressCheckRequestSummary()
const residentialChecksView = createResidentialChecksView()

const addressService = createMockAddressService()
const residentialChecksService = createMockResidentialChecksService()

const req = mockRequest({})
const res = mockResponse({})

let residentialChecksTaskListRoutes: ResidentialChecksTasklistRoutes

beforeEach(() => {
  residentialChecksTaskListRoutes = new ResidentialChecksTasklistRoutes(addressService, residentialChecksService)
  addressService.getStandardAddressCheckRequest.mockResolvedValue(addressCheckSummary)
  residentialChecksService.getResidentialChecksView.mockResolvedValue(residentialChecksView)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render list of residential checks tasks', async () => {
    req.params.prisonNumber = assessmentSummary.prisonNumber
    req.params.checkRequestId = addressCheckSummary.requestId.toString()

    await residentialChecksTaskListRoutes.GET(req, res)

    expect(addressService.getStandardAddressCheckRequest).toHaveBeenCalledWith(
      req.middleware.clientToken,
      req.params.prisonNumber,
      Number(req.params.checkRequestId),
    )

    expect(addressService.getStandardAddressCheckRequest).toHaveBeenCalledWith(
      req.middleware.clientToken,
      req.params.prisonNumber,
      Number(req.params.checkRequestId),
    )

    expect(res.render).toHaveBeenCalledWith('pages/communityOffenderManager/residentialChecks/tasklist', {
      addressCheckSummary,
      residentialChecksView,
    })
  })
})
