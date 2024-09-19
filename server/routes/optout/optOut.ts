import { Request, Response } from 'express'
import { path } from 'static-path'
import { CaseAdminCaseloadService } from '../../services'
import { convertToTitleCase } from '../../utils/utils'
import OptOutReasonType from '../../enumeration/optOutReasonType'
import { FieldValidationError } from '../../@types/FieldValidationError'

export default class OptOutRoutes {
  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

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
    const { optOutReason } = req.body

    const assessment = await this.caseAdminCaseloadService.getAssessmentSummary(
      req?.middleware?.clientToken,
      req.params.prisonNumber,
    )
    const name = convertToTitleCase(`${assessment.forename} ${assessment.surname}`.trim())
    const validationErrors = this.validateForm(optOutReason, req.body.otherReason)

    if (validationErrors.length !== 0) {
      return res.render(`pages/optOut/optOut`, {
        assessment: {
          ...assessment,
          name,
        },
        optOutReason,
        validationErrors,
      })
    }

    req.flash('optedOutOfHdc', `${name} has opted out of HDC`)
    const assessmentPath = path('/prison/assessment/:prisonNumber')
    return res.redirect(assessmentPath({ prisonNumber: req.params.prisonNumber }))
  }

  validateForm(optOutReason: string, otherReason: string): FieldValidationError[] {
    const validationErrors: FieldValidationError[] = []

    if (!optOutReason) {
      validationErrors.push({ field: 'optOutReason', message: 'Select an opt-out reason' })
    }

    if (optOutReason === OptOutReasonType.OTHER && !otherReason) {
      validationErrors.push({ field: 'otherReason', message: 'Enter the reason for opting out' })
    }

    return validationErrors
  }
}
