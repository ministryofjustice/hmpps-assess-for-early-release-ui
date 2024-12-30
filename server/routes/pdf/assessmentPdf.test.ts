import { createMockPdfService } from '../../services/__testutils/mock'
import { mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import AssessmentPdfRoutes from './assessmentPdf'

const pdfService = createMockPdfService()
const req = mockRequest({})
const res = mockResponse({})
const pdfBuffer = Buffer.from('pdf')

let assessmentPdfRoutes: AssessmentPdfRoutes

beforeEach(() => {
  assessmentPdfRoutes = new AssessmentPdfRoutes(pdfService)
  pdfService.getPdf.mockResolvedValue(pdfBuffer)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render pdf', async () => {
    await assessmentPdfRoutes.GET(req, res)
    expect(pdfService.getPdf).toHaveBeenCalledWith(req.middleware.clientToken, {
      title: 'Title from UI',
      message: 'Message from UI',
    })
    expect(res.renderPDF).toHaveBeenCalledWith('pages/forms/assessmentPdf', pdfBuffer, {})
  })
})
