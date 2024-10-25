import {
  createAddressSummary,
  createAssessmentSummary,
  createStandardAddressCheckRequestSummary,
} from '../../data/__testutils/testObjects'
import { mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockAddressService, createMockCaseAdminCaseloadService } from '../../services/__testutils/mock'
import { convertToTitleCase } from '../../utils/utils'
import { ValidationError } from '../../middleware/setUpValidationMiddleware'
import paths from '../paths'
import SelectAddressRoutes from './selectAddress'

const assessmentSummary = createAssessmentSummary({})

const addressService = createMockAddressService()
const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const req = mockRequest({})
const res = mockResponse({})

describe('select address routes', () => {
  let selectAddressRoutes: SelectAddressRoutes

  beforeEach(() => {
    selectAddressRoutes = new SelectAddressRoutes(addressService, caseAdminCaseloadService)
    addressService.findAddressesForPostcode.mockResolvedValue([createAddressSummary({})])
    addressService.addStandardAddressCheckRequest.mockResolvedValue(createStandardAddressCheckRequestSummary({}))
    caseAdminCaseloadService.getAssessmentSummary.mockResolvedValue(assessmentSummary)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('GET', () => {
    it('should render select address page', async () => {
      req.params.prisonNumber = assessmentSummary.prisonNumber
      req.query.postcode = 'SO128UF'
      await selectAddressRoutes.GET(req, res)

      expect(caseAdminCaseloadService.getAssessmentSummary).toHaveBeenCalledWith(
        req.middleware.clientToken,
        req.params.prisonNumber,
      )
      expect(res.render).toHaveBeenCalledWith('pages/curfewAddress/selectAddress', {
        assessmentSummary: {
          ...assessmentSummary,
          name: convertToTitleCase(`${assessmentSummary.forename} ${assessmentSummary.surname}`.trim()),
        },
        foundAddresses: [
          {
            uprn: '310030567',
            firstLine: '99, Hartland Road',
            secondLine: '',
            town: 'Reading',
            county: 'READING',
            postcode: 'RG2 8AF',
            country: 'England',
            xcoordinate: 472231,
            ycoordinate: 170070,
            addressLastUpdated: new Date('2020-06-25'),
          },
        ],
        findAddressUrl: paths.prison.assessment.curfewAddress.findAddress({ prisonNumber: req.params.prisonNumber }),
        formattedPostcode: 'SO12 8UF',
      })
    })
  })

  describe('POST', () => {
    it('validates POST request contains a search query', async () => {
      req.params.prisonNumber = assessmentSummary.prisonNumber
      await expect(selectAddressRoutes.POST(req, res)).rejects.toThrow(ValidationError)
    })

    it('add a standard address check request for a valid POST request', async () => {
      req.params.prisonNumber = assessmentSummary.prisonNumber
      req.body.selectedAddressUprn = '310030567'
      await selectAddressRoutes.POST(req, res)

      expect(addressService.addStandardAddressCheckRequest).toHaveBeenCalledWith(
        req?.middleware?.clientToken,
        req.params.prisonNumber,
        {
          preferencePriority: 'FIRST',
          addressUprn: req.body.selectedAddressUprn,
        },
      )

      expect(res.redirect).toHaveBeenCalledWith(
        paths.prison.assessment.curfewAddress.addResidentDetails({
          prisonNumber: req.params.prisonNumber,
          checkRequestId: '1',
        }),
      )
    })
  })
})
