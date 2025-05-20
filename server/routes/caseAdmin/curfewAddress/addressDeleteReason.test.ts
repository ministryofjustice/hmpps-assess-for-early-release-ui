import { createAgent, createAssessmentOverviewSummary } from '../../../data/__testutils/testObjects'
import { mockRequest, mockResponse } from '../../__testutils/requestTestUtils'
import { createMockAddressService, createMockCaseAdminCaseloadService } from '../../../services/__testutils/mock'
import AddressDeleteReasonRoutes from './addressDeleteReason'
import { ValidationError } from '../../../middleware/setUpValidationMiddleware'
import paths from '../../paths'

const assessmentOverviewSummary = createAssessmentOverviewSummary({})

const addressService = createMockAddressService()
const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const req = mockRequest({})
const res = mockResponse({})
res.locals.agent = createAgent()

describe('address delete reason', () => {
  let addressDeleteReasonRoutes: AddressDeleteReasonRoutes

  beforeEach(() => {
    addressDeleteReasonRoutes = new AddressDeleteReasonRoutes(addressService, caseAdminCaseloadService)
    caseAdminCaseloadService.getAssessmentOverviewSummary.mockResolvedValue(assessmentOverviewSummary)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('GET', () => {
    it('should render address delete reason page', async () => {
      req.params.prisonNumber = assessmentOverviewSummary.prisonNumber
      await addressDeleteReasonRoutes.GET(req, res)

      expect(caseAdminCaseloadService.getAssessmentOverviewSummary).toHaveBeenCalledWith(
        req.middleware.clientToken,
        res.locals.agent,
        req.params.prisonNumber,
      )

      expect(res.render).toHaveBeenCalledWith('pages/curfewAddress/addressDeleteReason', {
        assessmentSummary: assessmentOverviewSummary,
      })
    })
  })

  describe('POST', () => {
    req.params.prisonNumber = assessmentOverviewSummary.prisonNumber
    req.params.checkRequestId = '6'
    it('validates POST request contains moreInfoRequiredCheck', async () => {
      await expect(addressDeleteReasonRoutes.POST(req, res)).rejects.toThrow(ValidationError)
    })

    it('should redirect to assessment home page if data is valid', async () => {
      req.body.addressDeleteReasonType = 'OTHER_REASON'
      req.body.addressDeleteOtherReason = 'other reason'
      await addressDeleteReasonRoutes.POST(req, res)

      expect(addressService.updateCaseAdminAdditionalInformation).not.toHaveBeenCalled()

      expect(res.redirect).toHaveBeenCalledWith(paths.prison.assessment.home({ prisonNumber: req.params.prisonNumber }))
    })
  })
})
