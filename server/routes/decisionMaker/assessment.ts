import { Request, Response } from 'express'
import DecisionMakerCaseloadService from '../../services/decisionMakerCaseloadService'

export default class AssessmentRoutes {
  constructor(private readonly decisionMakerCaseloadService: DecisionMakerCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessmentSummary = await this.decisionMakerCaseloadService.getAssessmentOverviewSummary(
      req?.middleware?.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )

    res.render('pages/decisionMaker/assessment', {
      assessmentSummary: { ...assessmentSummary, tasks: assessmentSummary.tasks.PRISON_DM },
    })
  }
}
