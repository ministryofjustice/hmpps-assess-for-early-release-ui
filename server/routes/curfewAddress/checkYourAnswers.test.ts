import { createAssessmentSummary, createCheckRequestsForAssessmentSummary } from '../../data/__testutils/testObjects'
import { mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import { createMockAddressService, createMockCaseAdminCaseloadService } from '../../services/__testutils/mock'
import CheckYourAnswersRoutes from './checkYourAnswers'
import paths from '../paths'

const assessmentSummary = createAssessmentSummary({})
const addressSummary = createCheckRequestsForAssessmentSummary({})

const addressService = createMockAddressService()
const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const req = mockRequest({})
const res = mockResponse({})

describe('check your answers summary', () => {
  let checkYourAnswersRoutes: CheckYourAnswersRoutes

  beforeEach(() => {
    checkYourAnswersRoutes = new CheckYourAnswersRoutes(addressService, caseAdminCaseloadService)
    caseAdminCaseloadService.getAssessmentSummary.mockResolvedValue(assessmentSummary)
    addressService.getCheckRequestsForAssessment.mockResolvedValue([addressSummary])
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('GET', () => {
    it('should render check your answers summary', async () => {
      req.params.prisonNumber = assessmentSummary.prisonNumber
      await checkYourAnswersRoutes.GET(req, res)

      expect(caseAdminCaseloadService.getAssessmentSummary).toHaveBeenCalledWith(
        req.middleware.clientToken,
        req.params.prisonNumber,
      )

      expect(addressService.getCheckRequestsForAssessment).toHaveBeenCalledWith(
        req.middleware.clientToken,
        req.params.prisonNumber,
      )
      expect(res.render).toHaveBeenCalledWith('pages/curfewAddress/checkYourAnswers', {
        assessmentSummary,
        checkRequestsForassessmentSummary: [addressSummary],
      })
    })
  })

  describe('POST', () => {
    req.params.prisonNumber = assessmentSummary.prisonNumber

    it('should redirect to assessment home page', async () => {
      await checkYourAnswersRoutes.POST(req, res)

      expect(addressService.submitAssessmentForAddressChecks).toHaveBeenCalledWith(
        req.middleware.clientToken,
        req.params.prisonNumber,
      )
      expect(res.redirect).toHaveBeenCalledWith(
        paths.prison.assessment.home({
          prisonNumber: req.params.prisonNumber,
        }),
      )
    })
  })

  describe('DELETE', () => {
    req.params.prisonNumber = assessmentSummary.prisonNumber
    req.params.checkRequestId = '6'
    it('should call address service to delete selected assessment address', async () => {
      await checkYourAnswersRoutes.DELETE(req, res)

      expect(addressService.deleteAddressCheckRequest).toHaveBeenCalledWith(
        req.middleware.clientToken,
        req.params.prisonNumber,
        Number(req.params.checkRequestId),
      )
    })

    it('should redirect to check your answers page if the address count is greater than one', async () => {
      await checkYourAnswersRoutes.DELETE(req, res)
      expect(res.redirect).toHaveBeenCalledWith(
        paths.prison.assessment.curfewAddress.checkYourAnswers({ prisonNumber: req.params.prisonNumber }),
      )
    })

    it('should redirect to assessment home if there are no addresses', async () => {
      addressService.getCheckRequestsForAssessment.mockResolvedValue([])
      await checkYourAnswersRoutes.DELETE(req, res)
      expect(res.redirect).toHaveBeenCalledWith(paths.prison.assessment.home({ prisonNumber: req.params.prisonNumber }))
    })
  })
})
