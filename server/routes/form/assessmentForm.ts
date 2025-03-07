import { Request, Response } from 'express'
import FormService from '../../services/formService'
import { Agent } from '../../@types/assessForEarlyReleaseApiClientTypes'

export default class AssessmentFormRoutes {
  constructor(private readonly formService: FormService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const agent = res.locals.agent as Agent

    const pageData = await this.formService.getForm(req?.middleware?.clientToken, agent, {
      title: 'Title from UI',
      message: 'Message from UI',
    })

    res.renderPDF({ filename: 'document.pdf' }, pageData)
  }
}
