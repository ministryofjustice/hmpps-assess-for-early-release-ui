import { createAgent, createAssessmentOverviewSummary } from '../../data/__testutils/testObjects'
import { mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import {
  createMockCommunityOffenderManagerCaseloadService,
  createMockNonDisclosableInformationService,
} from '../../services/__testutils/mock'
import NonDisclosableInformationRoutes from './nonDisclosableInformation'
import { ValidationError } from '../../middleware/setUpValidationMiddleware'
import { NonDisclosableInformation } from '../../@types/assessForEarlyReleaseApiClientTypes'
import paths from '../paths'

const assessmentOverviewSummary = createAssessmentOverviewSummary({})

const caseloadService = createMockCommunityOffenderManagerCaseloadService()
const nonDisclosableInformationService = createMockNonDisclosableInformationService()
const req = mockRequest({})
const res = mockResponse({})
res.locals.agent = createAgent({ role: 'PROBATION_COM' })

describe('Record nondisclosable information', () => {
  let nonDisclosableInformationRoutes: NonDisclosableInformationRoutes

  beforeEach(() => {
    nonDisclosableInformationRoutes = new NonDisclosableInformationRoutes(
      caseloadService,
      nonDisclosableInformationService,
    )
    caseloadService.getAssessmentOverviewSummary.mockResolvedValue(assessmentOverviewSummary)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('GET', () => {
    it('should render the nondisclosable info page', async () => {
      req.params.prisonNumber = assessmentOverviewSummary.prisonNumber
      await nonDisclosableInformationRoutes.GET(req, res)

      expect(caseloadService.getAssessmentOverviewSummary).toHaveBeenCalledWith(
        req.middleware.clientToken,
        res.locals.agent,
        req.params.prisonNumber,
      )

      expect(res.render).toHaveBeenCalledWith('pages/communityOffenderManager/nonDisclosableInformation', {
        assessmentSummary: {
          ...assessmentOverviewSummary,
          hasNonDisclosableInformation: assessmentOverviewSummary.hasNonDisclosableInformation ? 'yes' : 'no',
        },
        prisonNumber: req.params.prisonNumber,
      })
    })

    it('should render has nondisclosable flag to null', async () => {
      const assessmentOverviewSummary1 = createAssessmentOverviewSummary({ hasNonDisclosableInformation: null })
      caseloadService.getAssessmentOverviewSummary.mockResolvedValue(assessmentOverviewSummary1)
      req.params.prisonNumber = assessmentOverviewSummary1.prisonNumber
      await nonDisclosableInformationRoutes.GET(req, res)

      expect(caseloadService.getAssessmentOverviewSummary).toHaveBeenCalledWith(
        req.middleware.clientToken,
        res.locals.agent,
        req.params.prisonNumber,
      )

      expect(res.render).toHaveBeenCalledWith('pages/communityOffenderManager/nonDisclosableInformation', {
        assessmentSummary: {
          ...assessmentOverviewSummary1,
          hasNonDisclosableInformation: null,
        },
        prisonNumber: req.params.prisonNumber,
      })
    })
  })

  describe('POST', () => {
    req.params.prisonNumber = assessmentOverviewSummary.prisonNumber
    req.body.hasNonDisclosableInformation = 'yes'
    req.body.nonDisclosableInformation = null
    it('validates POST request', async () => {
      await expect(nonDisclosableInformationRoutes.POST(req, res)).rejects.toThrow(ValidationError)
    })
    it('record non disclosable information with hasNonDisclosableInformation false for a valid POST request', async () => {
      req.body.hasNonDisclosableInformation = 'no'
      req.body.nonDisclosableInformation = 'info'
      const nonDisclosableInformation = {
        hasNonDisclosableInformation: false,
        nonDisclosableInformation: null,
      } as NonDisclosableInformation
      await nonDisclosableInformationRoutes.POST(req, res)
      expect(nonDisclosableInformationService.recordNonDisclosableInformation).toHaveBeenCalledWith(
        req?.middleware?.clientToken,
        res.locals.agent,
        req.params.prisonNumber,
        nonDisclosableInformation,
      )
      expect(res.redirect).toHaveBeenCalledWith(
        `${paths.probation.assessment.home({ prisonNumber: req.params.prisonNumber })}`,
      )
    })

    it('record non disclosable information with hasNonDisclosableInformation true for a valid POST request', async () => {
      req.body.hasNonDisclosableInformation = 'yes'
      req.body.nonDisclosableInformation = 'info'
      const nonDisclosableInformation = {
        hasNonDisclosableInformation: true,
        nonDisclosableInformation: req.body.nonDisclosableInformation,
      } as NonDisclosableInformation
      await nonDisclosableInformationRoutes.POST(req, res)
      expect(nonDisclosableInformationService.recordNonDisclosableInformation).toHaveBeenCalledWith(
        req?.middleware?.clientToken,
        res.locals.agent,
        req.params.prisonNumber,
        nonDisclosableInformation,
      )
      expect(res.redirect).toHaveBeenCalledWith(
        `${paths.probation.assessment.home({ prisonNumber: req.params.prisonNumber })}`,
      )
    })
  })
})
