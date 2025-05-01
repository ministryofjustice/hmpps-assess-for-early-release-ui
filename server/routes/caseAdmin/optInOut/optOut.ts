import { Request, Response } from 'express'
import { CaseAdminCaseloadService } from '../../../services'
import OptOutReasonType from '../../../enumeration/optOutReasonType'
import { FieldValidationError } from '../../../@types/FieldValidationError'
import OptInOutService from '../../../services/optInOutService'
import paths from '../../paths'
import { validateRequest } from '../../../middleware/setUpValidationMiddleware'

export default class OptOutRoutes {
  constructor(
    private readonly caseAdminCaseloadService: CaseAdminCaseloadService,
    private readonly optOutService: OptInOutService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessment = await this.caseAdminCaseloadService.getAssessmentOverviewSummary(
      req?.middleware?.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )

    res.render('pages/optOut/optOut', {
      assessment,
    })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    validateRequest(req, body => {
      const validationErrors: FieldValidationError[] = []

      if (!body.optOutReasonType) {
        validationErrors.push({ field: 'optOutReasonType', message: 'Select an opt-out reason' })
      }

      if (body.optOutReasonType === OptOutReasonType.OTHER && !body.otherReason) {
        validationErrors.push({ field: 'otherReason', message: 'Enter the reason for opting out' })
      }

      return validationErrors
    })

    const { optOutReasonType, otherReason } = req.body

    await this.optOutService.optOut(req?.middleware?.clientToken, req.params.prisonNumber, {
      optOutReasonType,
      otherReason,
      agent: res.locals.agent,
    })
    return res.redirect(paths.prison.assessment.home({ prisonNumber: req.params.prisonNumber }))
  }
}
