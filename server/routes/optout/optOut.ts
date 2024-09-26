import { Request, Response } from 'express'
import { CaseAdminCaseloadService } from '../../services'
import { convertToTitleCase } from '../../utils/utils'
import OptOutReasonType from '../../enumeration/optOutReasonType'
import { FieldValidationError } from '../../@types/FieldValidationError'
import OptOutService from '../../services/optOutService'
import paths from '../paths'
import { validateRequest } from '../../middleware/setUpValidationMiddleware'

export default class OptOutRoutes {
  constructor(
    private readonly caseAdminCaseloadService: CaseAdminCaseloadService,
    private readonly optOutService: OptOutService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessment = await this.caseAdminCaseloadService.getAssessmentSummary(
      req?.middleware?.clientToken,
      req.params.prisonNumber,
    )

    res.render('pages/optOut/optOut', {
      assessment: {
        ...assessment,
        name: convertToTitleCase(`${assessment.forename} ${assessment.surname}`.trim()),
      },
    })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    validateRequest(req, body => {
      const validationErrors: FieldValidationError[] = []

      if (!body.optOutReason) {
        validationErrors.push({ field: 'optOutReason', message: 'Select an opt-out reason' })
      }

      if (body.optOutReason === OptOutReasonType.OTHER && !body.otherReason) {
        validationErrors.push({ field: 'otherReason', message: 'Enter the reason for opting out' })
      }

      return validationErrors
    })

    const { optOutReason, otherReason } = req.body
    await this.optOutService.optOut(req?.middleware?.clientToken, req.params.prisonNumber, optOutReason, otherReason)
    return res.redirect(paths.prison.assessment.home({ prisonNumber: req.params.prisonNumber }))
  }
}
