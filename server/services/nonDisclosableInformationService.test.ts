import NonDisclosableInformationService from './nonDisclosableInformationService'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createAgent, createAssessmentOverviewSummary } from '../data/__testutils/testObjects'
import { Agent, NonDisclosableInformation } from '../@types/assessForEarlyReleaseApiClientTypes'

jest.mock('../data/hmppsComponentsClient')

describe('hmppsComponentsService', () => {
  const assessmentOverviewSummary = createAssessmentOverviewSummary({})
  const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
  const token = 'TOKEN-1'
  const agent = createAgent() as Agent

  const service = new NonDisclosableInformationService(assessForEarlyReleaseApiClient)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getComponents', () => {
    const nonDisclosableInformation = {
      hasNonDisclosableInformation: false,
      nonDisclosableInformation: '',
    } as NonDisclosableInformation
    it('should call the hmppsComponentsClient correctly and return the response', async () => {
      await service.recordNonDisclosableInformation(
        token,
        agent,
        assessmentOverviewSummary.prisonNumber,
        nonDisclosableInformation,
      )

      expect(assessForEarlyReleaseApiClient.recordNonDisclosableInformation).toHaveBeenCalledWith(
        token,
        agent,
        assessmentOverviewSummary.prisonNumber,
        nonDisclosableInformation,
      )
    })
  })
})
