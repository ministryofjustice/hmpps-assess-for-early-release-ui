import {
  createAgent,
  createAssessmentSummary,
  createCheckRequestsForAssessmentSummary,
  createResidentialChecksView,
} from '../../data/__testutils/testObjects'
import { mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import {
  createMockAddressService,
  createMockCaseAdminCaseloadService,
  createMockResidentialChecksService,
} from '../../services/__testutils/mock'
import ReviewInformationRoutes from './reviewInformation'

const assessmentSummary = createAssessmentSummary({})
const checkRequestsForAssessmentSummary = createCheckRequestsForAssessmentSummary({})
const residentialChecksView = createResidentialChecksView({})

const addressService = createMockAddressService()
const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const residentialChecksService = createMockResidentialChecksService()
const req = mockRequest({})
const res = mockResponse({})
res.locals.agent = createAgent()

describe('Review information and send checks to prison', () => {
  let reviewInformationRoutes: ReviewInformationRoutes

  beforeEach(() => {
    reviewInformationRoutes = new ReviewInformationRoutes(
      addressService,
      caseAdminCaseloadService,
      residentialChecksService,
    )
    addressService.getCheckRequestsForAssessment.mockResolvedValue(checkRequestsForAssessmentSummary)
    residentialChecksService.getResidentialChecksView.mockResolvedValue(residentialChecksView)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('GET', () => {
    it('should render the review information page', async () => {
      req.params.prisonNumber = assessmentSummary.prisonNumber
      await reviewInformationRoutes.GET(req, res)

      const addressTaskView = [
        {
          name: 'Address details and informed consent',
          code: 'address-details-and-informed-consent',
          status: 'NOT_STARTED',
          questionAnswers: [
            {
              question: 'Is the address connected to an electricity supply?',
              answer: 'No',
            },
            {
              question: 'Have you visited this address in person?',
              answer: 'I have not visited the address but I have spoken to the main occupier',
            },
            {
              question: 'Has the main occupier given informed consent for {offenderForename} to be released here?',
              answer: 'No',
            },
          ],
        },
        {
          name: 'Police check',
          code: 'police-check',
          status: 'NOT_STARTED',
          questionAnswers: [],
        },
        {
          name: "Children's services check",
          code: 'children-services-check',
          status: 'NOT_STARTED',
          questionAnswers: [],
        },
        {
          name: "Assess this person's risk",
          code: 'assess-this-persons-risk',
          status: 'NOT_STARTED',
          questionAnswers: [],
        },
        {
          name: 'Suitability decision',
          code: 'suitability-decision',
          status: 'NOT_STARTED',
          questionAnswers: [],
        },
        {
          name: 'Make a risk management decision',
          code: 'make-a-risk-management-decision',
          status: 'NOT_STARTED',
          questionAnswers: [],
        },
      ]
      expect(addressService.getCheckRequestsForAssessment).toHaveBeenCalledWith(
        req.middleware.clientToken,
        res.locals.agent,
        req.params.prisonNumber,
      )
      expect(residentialChecksService.getResidentialChecksView).toHaveBeenCalledWith(
        req.middleware.clientToken,
        res.locals.agent,
        req.params.prisonNumber,
        checkRequestsForAssessmentSummary[0].requestId,
      )

      expect(res.render).toHaveBeenCalledWith('pages/communityOffenderManager/reviewInformation', {
        prisonNumber: req.params.prisonNumber,
        preferredAddressCheck: checkRequestsForAssessmentSummary[0],
        preferredAddressTaskView: addressTaskView,
        secondAddressCheck: undefined,
        secondAddressTaskView: undefined,
      })
    })
  })
})
