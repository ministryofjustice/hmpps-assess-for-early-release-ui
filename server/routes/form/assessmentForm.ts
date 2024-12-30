import { Request, Response } from 'express'
import FormService from '../../services/formService'

export default class AssessmentFormRoutes {
  constructor(private readonly formService: FormService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const pageData = await this.formService.getForm(req?.middleware?.clientToken, {
      title: 'Title from UI',
      message: 'Message from UI',
    })

    res.renderPDF(pageData, {})
  }
}
