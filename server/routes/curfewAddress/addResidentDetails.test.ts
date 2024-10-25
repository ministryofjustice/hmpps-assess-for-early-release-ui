import { createAssessmentSummary, createStandardAddressCheckRequestSummary } from '../../data/__testutils/testObjects'
import { mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockAddressService, createMockCaseAdminCaseloadService } from '../../services/__testutils/mock'
import { convertToTitleCase } from '../../utils/utils'
import { ValidationError } from '../../middleware/setUpValidationMiddleware'
import paths from '../paths'
import AddResidentDetailsRoutes from './addResidentDetails'

const assessmentSummary = createAssessmentSummary({})
const addressCheckRequestSummary = createStandardAddressCheckRequestSummary({})

const addressService = createMockAddressService()
const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const req = mockRequest({})
const res = mockResponse({})

describe('add resident details routes', () => {
  let addResidentDetailsRoutes: AddResidentDetailsRoutes

  beforeEach(() => {
    addResidentDetailsRoutes = new AddResidentDetailsRoutes(addressService, caseAdminCaseloadService)
    addressService.getStandardAddressCheckRequest.mockResolvedValue(addressCheckRequestSummary)
    caseAdminCaseloadService.getAssessmentSummary.mockResolvedValue(assessmentSummary)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('GET', () => {
    it('should render add resident details ', async () => {
      req.params.prisonNumber = assessmentSummary.prisonNumber
      req.params.checkRequestId = '693'
      await addResidentDetailsRoutes.GET(req, res)

      expect(caseAdminCaseloadService.getAssessmentSummary).toHaveBeenCalledWith(
        req.middleware.clientToken,
        req.params.prisonNumber,
      )

      expect(addressService.getStandardAddressCheckRequest).toHaveBeenCalledWith(
        req?.middleware?.clientToken,
        req.params.prisonNumber,
        Number(req.params.checkRequestId),
      )
      expect(res.render).toHaveBeenCalledWith('pages/curfewAddress/addResidentDetails', {
        assessmentSummary: {
          ...assessmentSummary,
          name: convertToTitleCase(`${assessmentSummary.forename} ${assessmentSummary.surname}`.trim()),
        },
        address: {
          line1: '99, Hartland Road',
          postcode: 'RG2 8AF',
          town: 'Reading',
        },
      })
    })
  })

  describe('POST', () => {
    it('validates POST request contains resident details', async () => {
      req.params.prisonNumber = assessmentSummary.prisonNumber
      req.params.checkRequestId = '693'
      await expect(addResidentDetailsRoutes.POST(req, res)).rejects.toThrow(ValidationError)
    })

    it('add a resident for a valid POST request', async () => {
      req.params.prisonNumber = assessmentSummary.prisonNumber
      req.params.checkRequestId = '693'
      req.body.forename = 'Corina'
      req.body.surname = 'Ridgeway'
      req.body.relation = 'sister'
      req.body.age = 84

      await addResidentDetailsRoutes.POST(req, res)

      expect(addressService.getStandardAddressCheckRequest).toHaveBeenCalledWith(
        req?.middleware?.clientToken,
        req.params.prisonNumber,
        Number(req.params.checkRequestId),
      )

      expect(res.redirect).toHaveBeenCalledWith(
        `${paths.prison.assessment.curfewAddress.moreInformationRequiredCheck({ prisonNumber: req.params.prisonNumber, checkRequestId: req.params.checkRequestId })}`,
      )
    })
  })
})
