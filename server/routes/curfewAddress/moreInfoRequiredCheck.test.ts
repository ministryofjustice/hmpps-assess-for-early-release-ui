import { mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockCaseAdminCaseloadService, createMockAddressService } from '../../services/__testutils/mock'
import { convertToTitleCase } from '../../utils/utils'
import { ValidationError } from '../../middleware/setUpValidationMiddleware'
import paths from '../paths'
import MoreInfoRequiredCheckRoutes from './moreInfoRequiredCheck'
import { createAgent, createAssessmentSummary } from '../../data/__testutils/testObjects'

let moreInfoRequiredCheckRoutes: MoreInfoRequiredCheckRoutes

const assessmentSummary = createAssessmentSummary({})

const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const addressService = createMockAddressService()
const req = mockRequest({})
const res = mockResponse({})
res.locals.agent = createAgent()

beforeEach(() => {
  moreInfoRequiredCheckRoutes = new MoreInfoRequiredCheckRoutes(caseAdminCaseloadService, addressService)
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
      req.params.prisonNumber,
      Number(req.params.checkRequestId),
      {
        updateCaseAdminAdditionInfoRequest: {
          additionalInformation: req.body.addMoreInfo,
        },
        agent: res.locals.agent,
      },
    )

    expect(res.redirect).toHaveBeenCalledWith(
      paths.prison.assessment.enterCurfewAddressOrCasArea.requestMoreAddressChecks({
        prisonNumber: req.params.prisonNumber,
      }),
    )
  })
})
