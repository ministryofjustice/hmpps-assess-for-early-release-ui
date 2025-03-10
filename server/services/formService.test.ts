import { FormService } from '.'
import { Agent } from '../@types/assessForEarlyReleaseApiClientTypes'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createAgent } from '../data/__testutils/testObjects'

const AssessForEarlyReleaseApiClientBuilder = jest.fn()
const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'
const agent = createAgent() as Agent

describe('Pdf Service', () => {
  let formService: FormService

  beforeEach(() => {
    AssessForEarlyReleaseApiClientBuilder.mockReturnValue(assessForEarlyReleaseApiClient)
    formService = new FormService(AssessForEarlyReleaseApiClientBuilder)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('pdf', () => {
    it('get pdf', async () => {
      assessForEarlyReleaseApiClient.getForm.mockResolvedValue(Buffer.from('pdf'))

      await formService.getForm(token, agent, { title: 'title', message: 'message' })

      expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token, agent)
      expect(assessForEarlyReleaseApiClient.getForm).toHaveBeenCalledWith({ title: 'title', message: 'message' })
    })
  })
})
