import { OptOutService } from '.'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createAssessmentSummary } from '../data/__testutils/testObjects'
import OptOutReasonType from '../enumeration/optOutReasonType'
import { Agent } from '../@types/assessForEarlyReleaseApiClientTypes'

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
      const agent: Agent = {
        username: 'AFER_CA',
        role: 'PRISON_CA',
        onBehalfOf: 'TIS',
      }
      const assessmentSummary = createAssessmentSummary({})
      assessForEarlyReleaseApiClient.optOut.mockResolvedValue()

      await optOutService.optOut(token, assessmentSummary.prisonNumber, {
        optOutReasonType: OptOutReasonType.DOES_NOT_WANT_TO_BE_TAGGED,
        agent,
      })

      expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
      expect(assessForEarlyReleaseApiClient.optOut).toHaveBeenCalledWith('A1234AB', {
        otherDescription: undefined,
        reasonType: 'DOES_NOT_WANT_TO_BE_TAGGED',
        agent,
      })
    })
  })
})
