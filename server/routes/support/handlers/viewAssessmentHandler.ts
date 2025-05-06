import { Request, Response } from 'express'
import SupportService from '../../../services/supportService'
import paths from '../../paths'

export default class ViewAssessmentHandler {
  constructor(private readonly supportService: SupportService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessmentId = req.params.id
    const prisonNumber = req.params.prisonNumber as string

    if (assessmentId) {
      const assessment = await this.supportService.getAssessment(
        req?.middleware?.clientToken,
        res.locals.agent,
        assessmentId,
      )

      const events = await this.supportService.getAssessmentEvents(
        req?.middleware?.clientToken,
        res.locals.agent,
        assessmentId,
      )

      res.render('pages/support/offender/assessmentView', {
        assessmentId,
        prisonNumber,
        assessment,
        events,
      })
    } else {
      res.redirect(paths.support.offender.supportOffenderView({ prisonNumber }))
    }
  }
}
