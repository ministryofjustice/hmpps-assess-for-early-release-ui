import { createAssessmentSummary, createEligibilityAndSuitabilityCaseView } from '../../../data/__testutils/testObjects'
import { mockRequest, mockResponse } from '../../__testutils/requestTestUtils'
import { createMockEligibilityAndSuitabilityService } from '../../../services/__testutils/mock'
import ChecksCompleteRoutes from './checksComplete'

const eligibilityAndSuitabilityService = createMockEligibilityAndSuitabilityService()
const req = mockRequest({})
const res = mockResponse({})

let checksCompleteRoutes: ChecksCompleteRoutes

beforeEach(() => {
  checksCompleteRoutes = new ChecksCompleteRoutes(eligibilityAndSuitabilityService)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render eligibility and suitability outcome page', async () => {
    const assessmentSummary = createAssessmentSummary({})

    const criteria = createEligibilityAndSuitabilityCaseView({})
    eligibilityAndSuitabilityService.getCriteria.mockResolvedValue(criteria)

    req.params.prisonNumber = assessmentSummary.prisonNumber

    await checksCompleteRoutes.GET(req, res)

    expect(eligibilityAndSuitabilityService.getCriteria).toHaveBeenCalledWith(
      req.middleware.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )

    expect(res.render).toHaveBeenCalledWith('pages/caseAdmin/initialChecks/checksComplete', {
      criteria,
    })
  })
})
