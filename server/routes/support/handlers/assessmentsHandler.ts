import { Request, Response } from 'express'
import SupportService from '../../../services/supportService'
import logger from '../../../../logger'

export default class AssessmentSummaryHandler {
  constructor(private readonly supportService: SupportService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const [prisonNumber] = req.params.prisonNumber

    const assessments = await this.supportService.getAssessments(
      req?.middleware?.clientToken,
      res.locals.agent,
      prisonNumber,
    )

    logger.debug(`assessments ${assessments.length}`)

    res.render('pages/support/offender/assessments', {
      assessments,
      prisonNumber,
    })
  }
}
