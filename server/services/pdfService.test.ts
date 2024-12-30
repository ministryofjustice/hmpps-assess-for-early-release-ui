import { PdfService } from '.'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'

const AssessForEarlyReleaseApiClientBuilder = jest.fn()
const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'

describe('Pdf Service', () => {
  let pdfService: PdfService

  beforeEach(() => {
    AssessForEarlyReleaseApiClientBuilder.mockReturnValue(assessForEarlyReleaseApiClient)
    pdfService = new PdfService(AssessForEarlyReleaseApiClientBuilder)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('pdf', () => {
    it('get pdf', async () => {
      assessForEarlyReleaseApiClient.getPdf.mockResolvedValue(Buffer.from('pdf'))

      await pdfService.getPdf(token, { title: 'title', message: 'message' })

      expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
      expect(assessForEarlyReleaseApiClient.getPdf).toHaveBeenCalledWith({ title: 'title', message: 'message' })
    })
  })
})
