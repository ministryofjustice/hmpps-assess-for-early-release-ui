import {
  createAgent,
  createAssessmentOverviewSummary,
  createCheckRequestsForAssessmentSummary,
} from '../../../data/__testutils/testObjects'
import { mockRequest, mockResponse } from '../../__testutils/requestTestUtils'
import { createMockAddressService, createMockCaseAdminCaseloadService } from '../../../services/__testutils/mock'
import paths from '../../paths'
import CheckYourAnswersRoutes from './checkYourAnswers'

const assessmentOverviewSummary = createAssessmentOverviewSummary({})
const addressSummary = createCheckRequestsForAssessmentSummary({})

const addressService = createMockAddressService()
const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const req = mockRequest({})
const res = mockResponse({
  locals: {
    user: {
      username: 'AFER_CA',
    },
    activeCaseLoadId: 'KWV',
  },
})
res.locals.agent = createAgent()

describe('check your answers summary', () => {
  let checkYourAnswersRoutes: CheckYourAnswersRoutes

  beforeEach(() => {
    checkYourAnswersRoutes = new CheckYourAnswersRoutes(addressService, caseAdminCaseloadService)
    caseAdminCaseloadService.getAssessmentOverviewSummary.mockResolvedValue(assessmentOverviewSummary)
    addressService.getCheckRequestsForAssessment.mockResolvedValue([addressSummary])
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('GET', () => {
    it('should render check your answers summary', async () => {
      req.params.prisonNumber = assessmentOverviewSummary.prisonNumber
      await checkYourAnswersRoutes.GET(req, res)

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
      expect(res.render).toHaveBeenCalledWith('pages/curfewAddress/checkYourAnswers', {
        assessmentSummary: assessmentOverviewSummary,
        checkRequestsForAssessmentSummary: [addressSummary],
      })
    })
  })

  describe('POST', () => {
    req.params.prisonNumber = assessmentOverviewSummary.prisonNumber

    it('should redirect to assessment home page', async () => {
      await checkYourAnswersRoutes.POST(req, res)
      expect(addressService.submitAssessmentForAddressChecks).toHaveBeenCalledWith(
        req.middleware.clientToken,
        res.locals.agent,
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
    req.params.prisonNumber = assessmentOverviewSummary.prisonNumber
    req.params.checkRequestId = '6'
    it('should call address service to delete selected assessment address', async () => {
      await checkYourAnswersRoutes.DELETE(req, res)

      expect(addressService.deleteAddressCheckRequest).toHaveBeenCalledWith(
        req.middleware.clientToken,
        res.locals.agent,
        req.params.prisonNumber,
        Number(req.params.checkRequestId),
      )
    })

    it('should redirect to check your answers page if the address count is greater than one', async () => {
      await checkYourAnswersRoutes.DELETE(req, res)
      expect(res.redirect).toHaveBeenCalledWith(
        paths.prison.assessment.enterCurfewAddressOrCasArea.checkYourAnswers({ prisonNumber: req.params.prisonNumber }),
      )
    })

    it('should redirect to assessment home if there are no addresses', async () => {
      addressService.getCheckRequestsForAssessment.mockResolvedValue([])
      await checkYourAnswersRoutes.DELETE(req, res)
      expect(res.redirect).toHaveBeenCalledWith(paths.prison.assessment.home({ prisonNumber: req.params.prisonNumber }))
    })
  })
})
