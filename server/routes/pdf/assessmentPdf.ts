import { Request, Response } from 'express'
import PdfService from '../../services/pdfService'

export default class AssessmentPdfRoutes {
  constructor(private readonly pdfService: PdfService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const responsePdf = await this.pdfService.getPdf(req?.middleware?.clientToken, {
      title: 'Nishanth',
      message: 'Mahasamudram',
    })

    res.renderPDF('pages/forms/assessmentPdf', responsePdf, {})
  }
}
