import { Request, Response } from 'express'
import { path } from 'static-path'
import { CaseAdminCaseloadService } from '../../services'
import { convertToTitleCase } from '../../utils/utils'

export default class AssessmentRoutes {
  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentSummary(
      req?.middleware?.clientToken,
      req.params.prisonNumber,
    )
    const optOutPath = path('/prison/assessment/:prisonNumber/opt-out-check')

    res.render('pages/caseAdmin/assessment', {
      assessmentSummary: {
        ...assessmentSummary,
        name: convertToTitleCase(`${assessmentSummary.forename} ${assessmentSummary.surname}`.trim()),
      },
      optOutLink: optOutPath({ prisonNumber: assessmentSummary.prisonNumber }),
    })
  }
}
