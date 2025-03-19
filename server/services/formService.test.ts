import { FormService } from '.'
import { Agent } from '../@types/assessForEarlyReleaseApiClientTypes'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createAgent } from '../data/__testutils/testObjects'

const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'
const agent = createAgent() as Agent

describe('Pdf Service', () => {
  let formService: FormService

  beforeEach(() => {
    formService = new FormService(assessForEarlyReleaseApiClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('pdf', () => {
    it('get pdf', async () => {
      // Given
      const prisonNumber = 'A1234AA'
      const documentSubjectType = 'OFFENDER_ELIGIBLE_FORM'

      assessForEarlyReleaseApiClient.getForm.mockResolvedValue(Buffer.from('pdf'))

      // When
      await formService.getForm(token, agent, prisonNumber, documentSubjectType)

      // Then
      expect(assessForEarlyReleaseApiClient.getForm).toHaveBeenCalledWith(
        token,
        agent,
        prisonNumber,
        documentSubjectType,
      )
    })
  })
})
