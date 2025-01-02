import { FormService } from '.'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'

const AssessForEarlyReleaseApiClientBuilder = jest.fn()
const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'

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

      await formService.getForm(token, { title: 'title', message: 'message' })

      expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
      expect(assessForEarlyReleaseApiClient.getForm).toHaveBeenCalledWith({ title: 'title', message: 'message' })
    })
  })
})
