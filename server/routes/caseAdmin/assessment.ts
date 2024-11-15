import { Request, Response } from 'express'
import { CaseAdminCaseloadService } from '../../services'

export default class AssessmentRoutes {
  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentSummary(
      req?.middleware?.clientToken,
      req.params.prisonNumber,
    )

    res.render('pages/caseAdmin/assessment', {
      assessmentSummary: { ...assessmentSummary, tasks: assessmentSummary.tasks.PRISON_CA },
    })
  }
}
