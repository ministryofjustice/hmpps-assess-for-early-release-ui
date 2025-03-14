import {
  createAgent,
  createAssessmentOverviewSummary,
  createCheckRequestsForAssessmentSummary,
} from '../../data/__testutils/testObjects'
import { mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockAddressService, createMockCaseAdminCaseloadService } from '../../services/__testutils/mock'
import CheckCurfewAddressesRoutes from './checkCurfewAddresses'

const assessmentOverviewSummary = createAssessmentOverviewSummary({})
const addressSummary = createCheckRequestsForAssessmentSummary({})

const addressService = createMockAddressService()
const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const req = mockRequest({})
const res = mockResponse({})
res.locals.agent = createAgent({ role: 'PROBATION_COM' })

describe('check your answers summary', () => {
  let checkCurfewAddressesRoutes: CheckCurfewAddressesRoutes

  beforeEach(() => {
    checkCurfewAddressesRoutes = new CheckCurfewAddressesRoutes(addressService, caseAdminCaseloadService)
    caseAdminCaseloadService.getAssessmentOverviewSummary.mockResolvedValue(assessmentOverviewSummary)
    addressService.getCheckRequestsForAssessment.mockResolvedValue([addressSummary])
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('GET', () => {
    it('should render the check curfew addresses page', async () => {
      req.params.prisonNumber = assessmentOverviewSummary.prisonNumber
      await checkCurfewAddressesRoutes.GET(req, res)

      expect(caseAdminCaseloadService.getAssessmentOverviewSummary).toHaveBeenCalledWith(
        req.middleware.clientToken,
        res.locals.agent,
        req.params.prisonNumber,
      )

      expect(addressService.getCheckRequestsForAssessment).toHaveBeenCalledWith(
        req.middleware.clientToken,
        res.locals.agent,
        req.params.prisonNumber,
      )

      expect(res.render).toHaveBeenCalledWith('pages/curfewAddress/checkCurfewAddresses', {
        assessmentSummary: assessmentOverviewSummary,
        prisonNumber: req.params.prisonNumber,
        checkRequestsForAssessmentSummary: [addressSummary],
      })
    })
  })
})
