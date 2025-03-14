import { createAddressSummary, createAssessmentOverviewSummary } from '../../../data/__testutils/testObjects'
import { mockRequest, mockResponse } from '../../__testutils/requestTestUtils'
import { createMockAddressService, createMockCaseAdminCaseloadService } from '../../../services/__testutils/mock'
import FindAddressRoutes from './findAddress'
import { ValidationError } from '../../../middleware/setUpValidationMiddleware'
import paths from '../../paths'

const assessmentOverviewSummary = createAssessmentOverviewSummary({})

const addressService = createMockAddressService()
const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const req = mockRequest({})
const res = mockResponse({})

describe('find address routes', () => {
  let findAddressRoutes: FindAddressRoutes

  beforeEach(() => {
    findAddressRoutes = new FindAddressRoutes(addressService, caseAdminCaseloadService)
    addressService.findAddressesForPostcode.mockResolvedValue([createAddressSummary({})])
    caseAdminCaseloadService.getAssessmentOverviewSummary.mockResolvedValue(assessmentOverviewSummary)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('GET', () => {
    it('should render find address page', async () => {
      req.params.prisonNumber = assessmentOverviewSummary.prisonNumber
      await findAddressRoutes.GET(req, res)

      expect(caseAdminCaseloadService.getAssessmentOverviewSummary).toHaveBeenCalledWith(
        req.middleware.clientToken,
        res.locals.agent,
        req.params.prisonNumber,
      )
      expect(res.render).toHaveBeenCalledWith('pages/curfewAddress/findAddress', {
        assessmentSummary: assessmentOverviewSummary,
      })
    })
  })

  describe('POST', () => {
    it('validates POST request contains a search query', async () => {
      req.params.prisonNumber = assessmentOverviewSummary.prisonNumber
      await expect(findAddressRoutes.POST(req, res)).rejects.toThrow(ValidationError)
    })

    it('finds addresses for a valid POST request', async () => {
      req.params.prisonNumber = assessmentOverviewSummary.prisonNumber
      req.body.searchQuery = 'SO128UF'
      await findAddressRoutes.POST(req, res)

      expect(addressService.findAddressesForPostcode).toHaveBeenCalledWith(
        req.middleware.clientToken,
        res.locals.agent,
        req.body.searchQuery,
      )

      expect(res.redirect).toHaveBeenCalledWith(
        `${paths.prison.assessment.enterCurfewAddressOrCasArea.selectAddress({ prisonNumber: req.params.prisonNumber })}?postcode=${req.body.searchQuery}`,
      )
    })
  })
})
