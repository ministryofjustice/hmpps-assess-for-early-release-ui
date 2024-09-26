import { Request, Response } from 'express'
import { CaseAdminCaseloadService } from '../../services'
import { convertToTitleCase } from '../../utils/utils'
import { validateRequest } from '../../middleware/setUpValidationMiddleware'

export default class OptOutCheckRoutes {
  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessment = await this.caseAdminCaseloadService.getAssessmentSummary(
      req?.middleware?.clientToken,
      req.params.prisonNumber,
    )

    res.render('pages/optOut/optOutCheck', {
      assessment: {
        ...assessment,
        name: convertToTitleCase(`${assessment.forename} ${assessment.surname}`.trim()),
      },
    })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    validateRequest(req, body => {
      return body.considerForHdc ? [] : [{ field: 'considerForHdc', message: 'Select a value' }]
    })

    if (req.body.considerForHdc === 'yes') {
      return res.redirect(`/prison/assessment/${req.params.prisonNumber}/curfew-address`)
    }

    return res.redirect(`/prison/assessment/${req.params.prisonNumber}/opt-out`)
  }
}
