import { createEligibilityAndSuitabilityCaseView } from '../../../data/__testutils/testObjects'
import { mockedDate, mockRequest, mockResponse } from '../../__testutils/requestTestUtils'
import { createMockEligibilityAndSuitabilityService } from '../../../services/__testutils/mock'
import EligibilityAndSuitabilityQuestionListHandler from './eligibilityAndSuitabilityQuestionListHandler'

const view = createEligibilityAndSuitabilityCaseView({})

const eligibilityAndSuitabilityService = createMockEligibilityAndSuitabilityService()
const req = mockRequest({})
const res = mockResponse({})

let handler: EligibilityAndSuitabilityQuestionListHandler

beforeEach(() => {
  handler = new EligibilityAndSuitabilityQuestionListHandler(eligibilityAndSuitabilityService)
  eligibilityAndSuitabilityService.getCriteria.mockResolvedValue(view)
  mockedDate(new Date(2022, 6, 1))
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render eligibility and suitability question list', async () => {
    req.params.prisonNumber = view.assessmentSummary.prisonNumber
    await handler.GET(req, res)
    expect(eligibilityAndSuitabilityService.getCriteria).toHaveBeenCalledWith(
      req.middleware.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )
    expect(res.render).toHaveBeenCalledWith('pages/caseAdmin/initialChecks/eligibilityAndSuitabilityQuestionList', {
      criteria: view,
      totalChecks: 0,
      completedChecks: 0,
      completedAt: undefined,
      completedBy: '',
      completedOn: undefined,
    })
  })
})
