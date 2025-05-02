import { Request, Response } from 'express'
import SupportService from '../../../services/supportService'

export default class OffenderViewHandler {
  constructor(private readonly supportService: SupportService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const prisonNumber = req.params.prisonNumber as string

    const offender = await this.supportService.getOffender(req?.middleware?.clientToken, res.locals.agent, prisonNumber)

    const assessments = await this.supportService.getAssessments(
      req?.middleware?.clientToken,
      res.locals.agent,
      prisonNumber,
    )

    const currentAssessment = await this.supportService.getCurrentAssessment(
      req?.middleware?.clientToken,
      res.locals.agent,
      prisonNumber,
    )

    res.render('pages/support/offender/offenderView', {
      offender,
      assessments,
      prisonNumber,
      currentAssessment,
    })
  }
}
