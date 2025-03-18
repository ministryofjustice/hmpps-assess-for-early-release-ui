import {
  createAssessmentSummary,
  createEligibilityAndSuitabilityCaseView,
  createEligibilityCriterionProgress,
  createQuestion,
} from '../../../data/__testutils/testObjects'
import { mockRequest, mockResponse } from '../../__testutils/requestTestUtils'
import { createMockEligibilityAndSuitabilityService } from '../../../services/__testutils/mock'
import CheckRoutes from './check'
import { ValidationError } from '../../../middleware/setUpValidationMiddleware'
import paths from '../../paths'

const eligibilityAndSuitabilityService = createMockEligibilityAndSuitabilityService()
const req = mockRequest({})
const res = mockResponse({})

let checkRoutes: CheckRoutes

beforeEach(() => {
  checkRoutes = new CheckRoutes(eligibilityAndSuitabilityService)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render check questions', async () => {
    const assessmentSummary = createAssessmentSummary({})
    const eligibilityCheck1 = createEligibilityCriterionProgress({ code: 'code-1' })

    eligibilityAndSuitabilityService.getCriterion.mockResolvedValue({
      assessmentSummary,
      criterion: eligibilityCheck1,
      nextCriterion: undefined,
    })

    req.params.prisonNumber = assessmentSummary.prisonNumber
    req.params.type = 'eligibility'
    req.params.checkCode = eligibilityCheck1.code

    await checkRoutes.GET(req, res)

    expect(eligibilityAndSuitabilityService.getCriterion).toHaveBeenCalledWith(
      req.middleware.clientToken,
      req.params.prisonNumber,
      req.params.type,
      req.params.checkCode,
      res.locals.agent,
    )

    expect(res.render).toHaveBeenCalledWith('pages/caseAdmin/initialChecks/check', {
      assessmentSummary,
      type: 'eligibility',
      criterion: eligibilityCheck1,
    })
  })
})

describe('POST', () => {
  const assessmentSummary = createAssessmentSummary({})
  const question = createQuestion({})
  const eligibilityCheck1 = createEligibilityCriterionProgress({
    code: 'code-1',
    questions: [{ name: 'question1', text: 'answer the question?', answer: null, hint: null }],
  })
  const eligibilityCheck2 = createEligibilityCriterionProgress({ code: 'code-2' })
  const validPayload = { [question.name]: 'true', saveType: 'nextQuestion' }
  const invalidPayload = { [question.name]: '' }

  it('should submit valid answer and continue to next question', async () => {
    eligibilityAndSuitabilityService.getCriterion.mockResolvedValue({
      assessmentSummary,
      criterion: eligibilityCheck1,
      nextCriterion: eligibilityCheck2,
    })
    eligibilityAndSuitabilityService.saveCriterionAnswers.mockResolvedValue(createEligibilityAndSuitabilityCaseView({}))

    req.params.prisonNumber = assessmentSummary.prisonNumber
    req.params.type = 'eligibility-check'
    req.params.checkCode = eligibilityCheck1.code
    req.body = validPayload

    await checkRoutes.POST(req, res)

    expect(eligibilityAndSuitabilityService.getCriterion).toHaveBeenCalledWith(
      req.middleware.clientToken,
      req.params.prisonNumber,
      req.params.type,
      req.params.checkCode,
      res.locals.agent,
    )

    expect(res.redirect).toHaveBeenCalledWith(
      paths.prison.assessment.initialChecks.check({
        prisonNumber: req.params.prisonNumber,
        type: 'eligibility-check',
        checkCode: 'code-2',
      }),
    )
  })

  it('should submit valid answer and redirect to task list when user selects save', async () => {
    eligibilityAndSuitabilityService.getCriterion.mockResolvedValue({
      assessmentSummary,
      criterion: eligibilityCheck1,
      nextCriterion: eligibilityCheck2,
    })
    eligibilityAndSuitabilityService.saveCriterionAnswers.mockResolvedValue(createEligibilityAndSuitabilityCaseView({}))

    req.params.prisonNumber = assessmentSummary.prisonNumber
    req.params.type = 'eligibility-check'
    req.params.checkCode = eligibilityCheck1.code
    req.body = {
      ...validPayload,
      saveType: 'save',
    }

    await checkRoutes.POST(req, res)

    expect(eligibilityAndSuitabilityService.getCriterion).toHaveBeenCalledWith(
      req.middleware.clientToken,
      req.params.prisonNumber,
      req.params.type,
      req.params.checkCode,
      res.locals.agent,
    )

    expect(res.redirect).toHaveBeenCalledWith(
      paths.prison.assessment.initialChecks.tasklist({ prisonNumber: req.params.prisonNumber }),
    )
  })

  it('should throw validation error when no answer provided', async () => {
    eligibilityAndSuitabilityService.getCriterion.mockResolvedValue({
      assessmentSummary,
      criterion: eligibilityCheck1,
      nextCriterion: eligibilityCheck2,
    })

    req.params.prisonNumber = assessmentSummary.prisonNumber
    req.params.type = 'eligibility'
    req.params.checkCode = eligibilityCheck1.code
    req.body = invalidPayload

    await expect(() => checkRoutes.POST(req, res)).rejects.toThrow(ValidationError)
  })

  it('should redirect to tasklist after end of questions', async () => {
    eligibilityAndSuitabilityService.getCriterion.mockResolvedValue({
      assessmentSummary,
      criterion: eligibilityCheck1,
      nextCriterion: undefined,
    })
    eligibilityAndSuitabilityService.saveCriterionAnswers.mockResolvedValue(createEligibilityAndSuitabilityCaseView({}))

    req.params.prisonNumber = assessmentSummary.prisonNumber
    req.params.type = 'eligibility'
    req.params.checkCode = eligibilityCheck1.code
    req.body = validPayload

    await checkRoutes.POST(req, res)

    expect(eligibilityAndSuitabilityService.getCriterion).toHaveBeenCalledWith(
      req.middleware.clientToken,
      req.params.prisonNumber,
      req.params.type,
      req.params.checkCode,
      {},
    )

    expect(res.redirect).toHaveBeenCalledWith(
      paths.prison.assessment.initialChecks.tasklist({ prisonNumber: req.params.prisonNumber }),
    )
  })
})
