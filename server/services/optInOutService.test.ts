import { OptInOutService } from '.'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createAssessmentSummary } from '../data/__testutils/testObjects'
import OptOutReasonType from '../enumeration/optOutReasonType'
import { Agent } from '../@types/assessForEarlyReleaseApiClientTypes'

const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'

describe('Opt In / Out Service', () => {
  let optInOutService: OptInOutService

  beforeEach(() => {
    optInOutService = new OptInOutService(assessForEarlyReleaseApiClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('OptIn', () => {
    it('opts an offender into HDC', async () => {
      const agent: Agent = {
        username: 'AFER_CA',
        fullName: 'AFER CA',
        role: 'PRISON_CA',
        onBehalfOf: 'TIS',
      }
      const assessmentSummary = createAssessmentSummary({})
      assessForEarlyReleaseApiClient.optIn.mockResolvedValue()

      await optInOutService.optIn(token, assessmentSummary.prisonNumber, agent)

      expect(assessForEarlyReleaseApiClient.optIn).toHaveBeenCalledWith(token, agent, 'A1234AB')
    })
  })

  describe('OptOut', () => {
    it('opts an offender out of HDC', async () => {
      const agent: Agent = {
        username: 'AFER_CA',
        fullName: 'AFER CA',
        role: 'PRISON_CA',
        onBehalfOf: 'TIS',
      }
      const assessmentSummary = createAssessmentSummary({})
      assessForEarlyReleaseApiClient.optOut.mockResolvedValue()

      await optInOutService.optOut(token, assessmentSummary.prisonNumber, {
        optOutReasonType: OptOutReasonType.DOES_NOT_WANT_TO_BE_TAGGED,
        agent,
      })

      expect(assessForEarlyReleaseApiClient.optOut).toHaveBeenCalledWith(token, agent, 'A1234AB', {
        otherDescription: undefined,
        reasonType: 'DOES_NOT_WANT_TO_BE_TAGGED',
        agent,
      })
    })
  })
})
