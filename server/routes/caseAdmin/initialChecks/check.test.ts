import { createAssessmentSummary, createEligbilityCheck, createQuestion } from '../../../data/__testutils/testObjects'
import { mockRequest, mockResponse } from '../../__testutils/requestTestUtils'
import { createMockEligibilityAndSuitabilityService } from '../../../services/__testutils/mock'
import CheckRoutes from './check'
import { ValidationError } from '../../../middleware/setUpValidationMiddleware'

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
    const eligibilityCheck1 = createEligbilityCheck({ code: 'code-1' })

    eligibilityAndSuitabilityService.getInitialCheck.mockResolvedValue({
      assessmentSummary,
      check: eligibilityCheck1,
      nextCheck: undefined,
    })

    req.params.prisonNumber = assessmentSummary.prisonNumber
    req.params.type = 'eligibility'
    req.params.checkCode = eligibilityCheck1.code

    await checkRoutes.GET(req, res)

    expect(eligibilityAndSuitabilityService.getInitialCheck).toHaveBeenCalledWith(
      req.middleware.clientToken,
      req.params.prisonNumber,
      req.params.type,
      req.params.checkCode,
    )

    expect(res.render).toHaveBeenCalledWith('pages/caseAdmin/initialChecks/check', {
      assessmentSummary,
      type: 'eligibility',
      check: eligibilityCheck1,
    })
  })
})

describe('POST', () => {
  const assessmentSummary = createAssessmentSummary({})
  const question = createQuestion({})
  const eligibilityCheck1 = createEligbilityCheck({
    code: 'code-1',
    questions: [{ name: 'question1', text: 'answer the question?', answer: null, hint: null }],
  })
  const eligibilityCheck2 = createEligbilityCheck({ code: 'code-2' })
  const validPayload = { [question.name]: 'true' }
  const invalidPayload = { [question.name]: '' }

  it('should submit valid answer', async () => {
    eligibilityAndSuitabilityService.getInitialCheck.mockResolvedValue({
      assessmentSummary,
      check: eligibilityCheck1,
      nextCheck: eligibilityCheck2,
    })

    req.params.prisonNumber = assessmentSummary.prisonNumber
    req.params.type = 'eligibility'
    req.params.checkCode = eligibilityCheck1.code
    req.body = validPayload

    await checkRoutes.POST(req, res)

    expect(eligibilityAndSuitabilityService.getInitialCheck).toHaveBeenCalledWith(
      req.middleware.clientToken,
      req.params.prisonNumber,
      req.params.type,
      req.params.checkCode,
    )

    expect(res.redirect).toHaveBeenCalledWith('/prison/assessment/A1234AB/initial-checks/eligibility/code-2')
  })

  it('should throw validation error when no answer provided', async () => {
    eligibilityAndSuitabilityService.getInitialCheck.mockResolvedValue({
      assessmentSummary,
      check: eligibilityCheck1,
      nextCheck: eligibilityCheck2,
    })

    req.params.prisonNumber = assessmentSummary.prisonNumber
    req.params.type = 'eligibility'
    req.params.checkCode = eligibilityCheck1.code
    req.body = invalidPayload

    await expect(() => checkRoutes.POST(req, res)).rejects.toThrow(ValidationError)
  })

  it('should redirect to tasklist after end of questions', async () => {
    eligibilityAndSuitabilityService.getInitialCheck.mockResolvedValue({
      assessmentSummary,
      check: eligibilityCheck1,
      nextCheck: undefined,
    })

    req.params.prisonNumber = assessmentSummary.prisonNumber
    req.params.type = 'eligibility'
    req.params.checkCode = eligibilityCheck1.code
    req.body = validPayload

    await checkRoutes.POST(req, res)

    expect(eligibilityAndSuitabilityService.getInitialCheck).toHaveBeenCalledWith(
      req.middleware.clientToken,
      req.params.prisonNumber,
      req.params.type,
      req.params.checkCode,
    )

    expect(res.redirect).toHaveBeenCalledWith('/prison/assessment/A1234AB/initial-checks')
  })
})
