import paths from '../../paths'

import { createAgent, createAssessmentOverviewSummary } from '../../../data/__testutils/testObjects'
import { mockRequest, mockResponse } from '../../__testutils/requestTestUtils'
import { createMockCaseAdminCaseloadService } from '../../../services/__testutils/mock'
import NoAddressFoundRoutes from './noAddressFound'
import { convertToTitleCase } from '../../../utils/utils'

const assessmentOverviewSummary = createAssessmentOverviewSummary({})

const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const req = mockRequest({})
const res = mockResponse({})
res.locals.agent = createAgent()

let noAddressFoundRoutes: NoAddressFoundRoutes

beforeEach(() => {
  noAddressFoundRoutes = new NoAddressFoundRoutes(caseAdminCaseloadService)
  caseAdminCaseloadService.getAssessmentOverviewSummary.mockResolvedValue(assessmentOverviewSummary)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render find address page', async () => {
    req.params.prisonNumber = assessmentOverviewSummary.prisonNumber
    req.params.postcode = 'BA129FU'
    await noAddressFoundRoutes.GET(req, res)

    expect(caseAdminCaseloadService.getAssessmentOverviewSummary).toHaveBeenCalledWith(
      req.middleware.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )
    expect(res.render).toHaveBeenCalledWith('pages/curfewAddress/noAddressFound', {
      assessmentSummary: {
        ...assessmentOverviewSummary,
        name: convertToTitleCase(`${assessmentOverviewSummary.forename} ${assessmentOverviewSummary.surname}`.trim()),
      },
      postcode: req.params.postcode,
      findAddressUrl: paths.prison.assessment.enterCurfewAddressOrCasArea.findAddress({
        prisonNumber: req.params.prisonNumber,
      }),
    })
  })
})
