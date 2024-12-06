import { mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockCaseAdminCaseloadService } from '../../services/__testutils/mock'
import { convertToTitleCase } from '../../utils/utils'
import { ValidationError } from '../../middleware/setUpValidationMiddleware'
import paths from '../paths'
import MoreInfoRequiredCheckRoutes from './moreInfoRequiredCheck'
import { createAssessmentSummary, createStandardAddressCheckRequestSummary } from '../../data/__testutils/testObjects'

let moreInfoRequiredCheckRoutes: MoreInfoRequiredCheckRoutes

const assessmentSummary = createAssessmentSummary({})

const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const addressCheckRequestSummary = createStandardAddressCheckRequestSummary({})
const req = mockRequest({})
const res = mockResponse({})

beforeEach(() => {
  moreInfoRequiredCheckRoutes = new MoreInfoRequiredCheckRoutes(caseAdminCaseloadService, addressCheckRequestSummary)
  caseAdminCaseloadService.getAssessmentSummary.mockResolvedValue(assessmentSummary)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render more info required page', async () => {
    req.params.prisonNumber = assessmentSummary.prisonNumber
    await moreInfoRequiredCheckRoutes.GET(req, res)
    expect(caseAdminCaseloadService.getAssessmentSummary).toHaveBeenCalledWith(
      req.middleware.clientToken,
      req.params.prisonNumber,
    )
    expect(res.render).toHaveBeenCalledWith('pages/curfewAddress/moreInfoRequiredCheck', {
      assessmentSummary: {
        ...assessmentSummary,
        name: convertToTitleCase(`${assessmentSummary.forename} ${assessmentSummary.surname}`.trim()),
      },
    })
  })
})

describe('POST', () => {
  req.params.prisonNumber = assessmentSummary.prisonNumber
  req.params.checkRequestId = '6'
  it('validates POST request contains moreInfoRequiredCheck', async () => {
    await expect(moreInfoRequiredCheckRoutes.POST(req, res)).rejects.toThrow(ValidationError)
  })

  it('should redirect to requestMoreAddressChecks page if moreInfoRequiredCheck is no', async () => {
    req.body.moreInfoRequiredCheck = 'no'
    await moreInfoRequiredCheckRoutes.POST(req, res)

    expect(res.redirect).toHaveBeenCalledWith(
      paths.prison.assessment.curfewAddress.requestMoreAddressChecks({
        prisonNumber: req.params.prisonNumber,
      }),
    )
  })

  it('should redirect to moreInformationRequired page if moreInfoRequiredCheck is yes', async () => {
    req.body.moreInfoRequiredCheck = 'yes'
    await moreInfoRequiredCheckRoutes.POST(req, res)

    expect(res.redirect).toHaveBeenCalledWith(
      paths.prison.assessment.curfewAddress.moreInformationRequired({
        prisonNumber: req.params.prisonNumber,
        checkRequestId: req.params.checkRequestId,
      }),
    )
  })
})
