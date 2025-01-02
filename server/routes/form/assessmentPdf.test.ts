import { createMockFormService } from '../../services/__testutils/mock'
import { mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import AssessmentPdfRoutes from './assessmentForm'

const formService = createMockFormService()
const req = mockRequest({})
const res = mockResponse({})
const pdfBuffer = Buffer.from('pdf')

let assessmentPdfRoutes: AssessmentPdfRoutes

beforeEach(() => {
  assessmentPdfRoutes = new AssessmentPdfRoutes(formService)
  formService.getForm.mockResolvedValue(pdfBuffer)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET', () => {
  it('should render pdf', async () => {
    await assessmentPdfRoutes.GET(req, res)
    expect(formService.getForm).toHaveBeenCalledWith(req.middleware.clientToken, {
      title: 'Title from UI',
      message: 'Message from UI',
    })
    expect(res.renderPDF).toHaveBeenCalledWith({ filename: 'document.pdf' }, pdfBuffer)
  })
})
