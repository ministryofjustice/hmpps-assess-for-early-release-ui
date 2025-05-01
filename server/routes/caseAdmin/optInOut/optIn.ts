import { Request, Response } from 'express'
import { CaseAdminCaseloadService } from '../../../services'
import { FieldValidationError } from '../../../@types/FieldValidationError'
import OptInOutService from '../../../services/optInOutService'
import paths from '../../paths'
import { validateRequest } from '../../../middleware/setUpValidationMiddleware'

export default class OptInRoutes {
  constructor(
    private readonly caseAdminCaseloadService: CaseAdminCaseloadService,
    private readonly optInOutService: OptInOutService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessment = await this.caseAdminCaseloadService.getAssessmentOverviewSummary(
      req?.middleware?.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )

    res.render('pages/optInOut/optIn', {
      assessment,
    })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    validateRequest(req, body => {
      const validationErrors: FieldValidationError[] = []

      if (body.resumeApplication !== 'Yes' && body.resumeApplication !== 'No') {
        validationErrors.push({ field: 'otherReason', message: 'Select whether you want to resume the application' })
      }

      return validationErrors
    })

    if (req.body.resumeApplication === 'Yes') {
      await this.optInOutService.optIn(req?.middleware?.clientToken, req.params.prisonNumber, res.locals.agent)
    }

    return res.redirect(paths.prison.assessment.home({ prisonNumber: req.params.prisonNumber }))
  }
}
