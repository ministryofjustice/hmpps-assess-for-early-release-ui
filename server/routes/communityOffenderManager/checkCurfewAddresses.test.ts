import { createAssessmentSummary, createCheckRequestsForAssessmentSummary } from '../../data/__testutils/testObjects'
import { mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockAddressService, createMockCaseAdminCaseloadService } from '../../services/__testutils/mock'
import CheckCurfewAddressesRoutes from './checkCurfewAddresses'

const assessmentSummary = createAssessmentSummary({})
const addressSummary = createCheckRequestsForAssessmentSummary({})

const addressService = createMockAddressService()
const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const req = mockRequest({})
const res = mockResponse({})

describe('check your answers summary', () => {
  let checkCurfewAddressesRoutes: CheckCurfewAddressesRoutes

  beforeEach(() => {
    checkCurfewAddressesRoutes = new CheckCurfewAddressesRoutes(addressService, caseAdminCaseloadService)
    caseAdminCaseloadService.getAssessmentSummary.mockResolvedValue(assessmentSummary)
    addressService.getCheckRequestsForAssessment.mockResolvedValue([addressSummary])
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('GET', () => {
    it('should render the check curfew addresses page', async () => {
      req.params.prisonNumber = assessmentSummary.prisonNumber
      await checkCurfewAddressesRoutes.GET(req, res)

      expect(caseAdminCaseloadService.getAssessmentSummary).toHaveBeenCalledWith(
        req.middleware.clientToken,
        req.params.prisonNumber,
      )

      expect(addressService.getCheckRequestsForAssessment).toHaveBeenCalledWith(
        req.middleware.clientToken,
        req.params.prisonNumber,
      )

      expect(res.render).toHaveBeenCalledWith('pages/curfewAddress/checkCurfewAddresses', {
        assessmentSummary,
        checkRequestsForAssessmentSummary: [addressSummary],
      })
    })
  })
})
