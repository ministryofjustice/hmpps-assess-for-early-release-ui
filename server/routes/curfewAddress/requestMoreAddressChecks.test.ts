import { mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockAddressService, createMockCaseAdminCaseloadService } from '../../services/__testutils/mock'
import { convertToTitleCase } from '../../utils/utils'
import { ValidationError } from '../../middleware/setUpValidationMiddleware'
import paths from '../paths'
import { createAssessmentSummary, createCheckRequestsForAssessmentSummary } from '../../data/__testutils/testObjects'
import RequestMoreAddressChecksRoutes from './requestMoreAddressChecks'

let requestMoreAddressChecksRoutes: RequestMoreAddressChecksRoutes

const assessmentSummary = createAssessmentSummary({})
const addressSummary = createCheckRequestsForAssessmentSummary({})

const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const addressService = createMockAddressService()
const req = mockRequest({})
const res = mockResponse({})

beforeEach(() => {
  requestMoreAddressChecksRoutes = new RequestMoreAddressChecksRoutes(addressService, caseAdminCaseloadService)
  caseAdminCaseloadService.getAssessmentSummary.mockResolvedValue(assessmentSummary)
  addressService.getCheckRequestsForAssessment.mockResolvedValue(addressSummary)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render more address checks page', async () => {
    req.params.prisonNumber = assessmentSummary.prisonNumber
    await requestMoreAddressChecksRoutes.GET(req, res)
    expect(caseAdminCaseloadService.getAssessmentSummary).toHaveBeenCalledWith(
      req.middleware.clientToken,
      req.params.prisonNumber,
    )
    expect(addressService.getCheckRequestsForAssessment).toHaveBeenCalledWith(
      req.middleware.clientToken,
      req.params.prisonNumber,
    )
    expect(res.render).toHaveBeenCalledWith('pages/curfewAddress/requestMoreAddressChecks', {
      assessmentSummary: {
        ...assessmentSummary,
        name: convertToTitleCase(`${assessmentSummary.forename} ${assessmentSummary.surname}`.trim()),
      },
      prisonNumber: assessmentSummary.prisonNumber,
      addressSummary,
    })
  })
})

describe('POST', () => {
  req.params.prisonNumber = assessmentSummary.prisonNumber
  req.params.checkRequestId = '6'
  it('validates POST request contains moreInfoRequiredCheck', async () => {
    await expect(requestMoreAddressChecksRoutes.POST(req, res)).rejects.toThrow(ValidationError)
  })

  it('should redirect to check your answers page if moreAddressChecks is no', async () => {
    req.body.moreAddressChecks = 'no'
    await requestMoreAddressChecksRoutes.POST(req, res)

    expect(res.redirect).toHaveBeenCalledWith(
      paths.prison.assessment.curfewAddress.checkYourAnswers({
        prisonNumber: req.params.prisonNumber,
      }),
    )
  })

  it('should redirect to find address page if moreAddressChecks is yes', async () => {
    req.body.moreAddressChecks = 'yes'
    await requestMoreAddressChecksRoutes.POST(req, res)

    expect(res.redirect).toHaveBeenCalledWith(
      paths.prison.assessment.curfewAddress.findAddress({
        prisonNumber: req.params.prisonNumber,
      }),
    )
  })
})

describe('DELETE', () => {
  req.params.prisonNumber = assessmentSummary.prisonNumber
  req.params.checkRequestId = '6'
  it('should call address service to delete selected assessment address', async () => {
    await requestMoreAddressChecksRoutes.DELETE(req, res)

    expect(addressService.deleteAddressCheckRequest).toHaveBeenCalledWith(
      req.middleware.clientToken,
      req.params.prisonNumber,
      Number(req.params.checkRequestId),
    )
  })

  it('should redirect to request more address checks page', async () => {
    await requestMoreAddressChecksRoutes.DELETE(req, res)
    expect(res.redirect).toHaveBeenCalledWith(
      paths.prison.assessment.curfewAddress.requestMoreAddressChecks({ prisonNumber: req.params.prisonNumber }),
    )
  })
})
