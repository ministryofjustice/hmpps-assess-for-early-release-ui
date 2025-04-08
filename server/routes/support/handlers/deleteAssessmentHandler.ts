import { Request, Response } from 'express'
import SupportService from '../../../services/supportService'
import paths from '../../paths'

export default class DeleteAssessmentHandler {
  constructor(private readonly supportService: SupportService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessmentId = req.params.id as string
    const prisonNumber = req.params.prisonNumber as string

    await this.supportService.deleteAssessment(req?.middleware?.clientToken, res.locals.agent, assessmentId)

    return res.redirect(`${paths.support.offender.supportOffenderView({ prisonNumber })}`)
  }
}
