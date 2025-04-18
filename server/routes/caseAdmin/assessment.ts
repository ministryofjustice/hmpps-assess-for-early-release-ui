import { Request, Response } from 'express'
import { CaseAdminCaseloadService } from '../../services'
import { getStatusFormsMap } from '../../config/forms'

export default class AssessmentRoutes {
  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentOverviewSummary(
      req?.middleware?.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )
    const { status } = assessmentSummary

    res.render('pages/caseAdmin/assessment', {
      assessmentSummary: {
        ...assessmentSummary,
        tasks: assessmentSummary.tasks.PRISON_CA,
        formsToShow: getStatusFormsMap[status],
      },
    })
  }
}
