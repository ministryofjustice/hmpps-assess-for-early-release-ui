import { Request, Response } from 'express'
import DecisionMakerCaseloadService from '../../services/decisionMakerCaseloadService'

export default class AssessmentRoutes {
  constructor(private readonly decisionMakerCaseloadService: DecisionMakerCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessmentSummary = await this.decisionMakerCaseloadService.getAssessmentSummary(
      req?.middleware?.clientToken,
      req.params.prisonNumber,
    )

    res.render('pages/decisionMaker/assessment', {
      assessmentSummary: { ...assessmentSummary, tasks: assessmentSummary.tasks.PRISON_DM },
    })
  }
}
