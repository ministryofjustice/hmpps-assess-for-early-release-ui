import { Request, Response } from 'express'
import { CaseAdminCaseloadService } from '../../services'
import { validateRequest } from '../../middleware/setUpValidationMiddleware'
import { FieldValidationError } from '../../@types/FieldValidationError'
import paths from '../paths'

export default class NonDisclosableInformationRoutes {
  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { prisonNumber } = req.params
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentOverviewSummary(
      req?.middleware?.clientToken,
      res.locals.agent,
      prisonNumber,
    )
    res.render('pages/communityOffenderManager/nonDisclosableInformation', { assessmentSummary, prisonNumber })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    const { prisonNumber } = req.params
    const { forename } = await this.caseAdminCaseloadService.getAssessmentOverviewSummary(
      req?.middleware?.clientToken,
      res.locals.agent,
      prisonNumber,
    )

    validateRequest(req, body => {
      const validationErrors: FieldValidationError[] = []
      const { isNonDisclosable, nonDisclosableReason } = body

      if (isNonDisclosable === 'yes' && !nonDisclosableReason) {
        validationErrors.push({ field: 'nonDisclosableReason', message: 'Enter non-disclosable information' })
      }

      if (!isNonDisclosable) {
        validationErrors.push({
          field: 'isNonDisclosable',
          message: `Please select whether you need to enter any information that must not be disclosed to ${forename}`,
        })
      }

      return validationErrors
    })

    return res.redirect(paths.probation.assessment.home({ prisonNumber: req.params.prisonNumber }))
  }
}
