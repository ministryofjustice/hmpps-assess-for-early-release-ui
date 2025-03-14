import moment from 'moment/moment'
import { createMockFormService } from '../../services/__testutils/mock'
import { mockRequest, mockResponse } from '../__testutils/requestTestUtils'
import AssessmentPdfRoutes from './assessmentForm'

const formService = createMockFormService()
const req = mockRequest({})
const res = mockResponse({})
const pdfBuffer = Buffer.from('pdf')
res.locals.agent = { role: 'PRISON_DM' }

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
    // Given
    const prisonNumber = 'A1234AA'
    const documentSubjectType = 'OFFENDER_ELIGIBLE_FORM'
    const today = moment().format('DD-MM-YY')
    const fileName = `${prisonNumber}_${documentSubjectType}_${today}.pdf`

    req.params.prisonNumber = prisonNumber
    req.params.documentSubjectType = documentSubjectType

    // When
    await assessmentPdfRoutes.GET(req, res)

    // Then
    expect(formService.getForm).toHaveBeenCalledWith(
      req.middleware.clientToken,
      res.locals.agent,
      prisonNumber,
      documentSubjectType,
    )
    expect(res.renderPDF).toHaveBeenCalledWith({ filename: fileName }, pdfBuffer)
  })
})

describe('GET error when incorrect document sub type', () => {
  it('should render error', async () => {
    // Given
    const prisonNumber = 'A1234AA'
    const documentSubjectType = 'I_DONT_EXIST'

    req.params.prisonNumber = prisonNumber
    req.params.documentSubjectType = documentSubjectType

    // When
    await expect(assessmentPdfRoutes.GET(req, res))
      // Then
      .rejects.toThrow(new Error(`Unknown document type : ${documentSubjectType}`))
  })
})
