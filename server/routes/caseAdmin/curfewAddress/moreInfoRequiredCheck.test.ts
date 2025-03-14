import { mockRequest, mockResponse } from '../../__testutils/requestTestUtils'
import { createMockCaseAdminCaseloadService, createMockAddressService } from '../../../services/__testutils/mock'
import { ValidationError } from '../../../middleware/setUpValidationMiddleware'
import paths from '../../paths'
import MoreInfoRequiredCheckRoutes from './moreInfoRequiredCheck'
import { createAgent, createAssessmentOverviewSummary } from '../../../data/__testutils/testObjects'
import { convertToTitleCase } from '../../../utils/utils'

let moreInfoRequiredCheckRoutes: MoreInfoRequiredCheckRoutes

const assessmentOverviewSummary = createAssessmentOverviewSummary({})

const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const addressService = createMockAddressService()
const req = mockRequest({})
const res = mockResponse({})
res.locals.agent = createAgent()

beforeEach(() => {
  moreInfoRequiredCheckRoutes = new MoreInfoRequiredCheckRoutes(caseAdminCaseloadService, addressService)
  caseAdminCaseloadService.getAssessmentOverviewSummary.mockResolvedValue(assessmentOverviewSummary)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render more info required page', async () => {
    req.params.prisonNumber = assessmentOverviewSummary.prisonNumber
    await moreInfoRequiredCheckRoutes.GET(req, res)
    expect(caseAdminCaseloadService.getAssessmentOverviewSummary).toHaveBeenCalledWith(
      req.middleware.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )
    expect(res.render).toHaveBeenCalledWith('pages/curfewAddress/moreInfoRequiredCheck', {
      assessmentSummary: assessmentOverviewSummary,
    })
  })
})

describe('POST', () => {
  req.params.prisonNumber = assessmentOverviewSummary.prisonNumber
  req.params.checkRequestId = '6'
  it('validates POST request contains moreInfoRequiredCheck', async () => {
    await expect(moreInfoRequiredCheckRoutes.POST(req, res)).rejects.toThrow(ValidationError)
  })

  it('should redirect to requestMoreAddressChecks page if moreInfoRequiredCheck is no', async () => {
    req.body.moreInfoRequiredCheck = 'no'
    await moreInfoRequiredCheckRoutes.POST(req, res)

    expect(addressService.updateCaseAdminAdditionalInformation).not.toHaveBeenCalled()

    expect(res.redirect).toHaveBeenCalledWith(
      paths.prison.assessment.enterCurfewAddressOrCasArea.requestMoreAddressChecks({
        prisonNumber: req.params.prisonNumber,
      }),
    )
  })

  it('should redirect to moreInformationRequired page if moreInfoRequiredCheck is yes', async () => {
    req.body.moreInfoRequiredCheck = 'yes'
    req.body.addMoreInfo = 'more info'
    await moreInfoRequiredCheckRoutes.POST(req, res)

    expect(addressService.updateCaseAdminAdditionalInformation).toHaveBeenCalledWith(
      req.middleware.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
      Number(req.params.checkRequestId),
      {
        additionalInformation: req.body.addMoreInfo,
      },
    )

    expect(res.redirect).toHaveBeenCalledWith(
      paths.prison.assessment.enterCurfewAddressOrCasArea.requestMoreAddressChecks({
        prisonNumber: req.params.prisonNumber,
      }),
    )
  })
})
