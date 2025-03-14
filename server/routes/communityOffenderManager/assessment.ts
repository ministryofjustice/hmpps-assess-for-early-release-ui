import { Request, Response } from 'express'
import type { CommunityOffenderManagerCaseloadService } from '../../services'

export default class AssessmentRoutes {
  constructor(private readonly caseAdminCaseloadService: CommunityOffenderManagerCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentOverviewSummary(
      req?.middleware?.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )

    res.render('pages/communityOffenderManager/assessment', {
      assessmentSummary: { ...assessmentSummary, tasks: assessmentSummary.tasks.PROBATION_COM },
    })
  }
}
