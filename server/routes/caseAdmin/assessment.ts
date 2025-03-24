import { Request, Response } from 'express'
import { CaseAdminCaseloadService } from '../../services'
import AssessmentStatus from '../../enumeration/assessmentStatus'
import { AssessmentOverviewSummary } from '../../@types/assessForEarlyReleaseApiClientTypes'
import { Form, getBaseForms, getStatusFormsMap } from '../../config/forms'

export default class AssessmentRoutes {
  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentOverviewSummary(
      req?.middleware?.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )

    res.render('pages/caseAdmin/assessment', {
      assessmentSummary: {
        ...assessmentSummary,
        tasks: assessmentSummary.tasks.PRISON_CA,
        formsToShow: this.getFormsToShow(assessmentSummary),
      },
    })
  }

  private getFormsToShow(assessmentSummary: AssessmentOverviewSummary): Form[] {
    const { status } = assessmentSummary
    const baseForms = getBaseForms
    const statusForms = getStatusFormsMap[status] || []

    if (status === AssessmentStatus.INELIGIBLE_OR_UNSUITABLE || status === AssessmentStatus.NOT_STARTED) {
      return statusForms
    }

    return [...baseForms, ...statusForms]
  }
}
