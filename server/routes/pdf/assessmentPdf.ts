import { Request, Response } from 'express'
import PdfService from '../../services/pdfService'

export default class AssessmentPdfRoutes {
  constructor(private readonly pdfService: PdfService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const responsePdf = await this.pdfService.getPdf(req?.middleware?.clientToken, {
      title: 'Title from UI',
      message: 'Message from UI',
    })

    res.renderPDF('pages/forms/assessmentPdf', responsePdf, {})
  }
}
