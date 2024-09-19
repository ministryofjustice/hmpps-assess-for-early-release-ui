import { OptOutService } from '.'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createAssessmentSummary } from '../data/__testutils/testObjects'
import OptOutReasonType from '../enumeration/optOutReasonType'

const AssessForEarlyReleaseApiClientBuilder = jest.fn()
const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'

describe('Opt Out Service', () => {
  let optOutService: OptOutService

  beforeEach(() => {
    AssessForEarlyReleaseApiClientBuilder.mockReturnValue(assessForEarlyReleaseApiClient)
    optOutService = new OptOutService(AssessForEarlyReleaseApiClientBuilder)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('OptOut', () => {
    it('opts an offender out of HDC', async () => {
      const assessmentSummary = createAssessmentSummary({})
      assessForEarlyReleaseApiClient.optOut.mockResolvedValue()

      await optOutService.optOut(token, assessmentSummary.prisonNumber, OptOutReasonType.DOES_NOT_WANT_TO_BE_TAGGED)

      expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
      expect(assessForEarlyReleaseApiClient.optOut).toHaveBeenCalledWith('A1234AB', {
        otherDescription: undefined,
        reasonType: 'DOES_NOT_WANT_TO_BE_TAGGED',
      })
    })
  })
})
