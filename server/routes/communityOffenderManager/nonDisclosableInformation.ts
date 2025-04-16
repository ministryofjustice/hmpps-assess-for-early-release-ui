import { Request, Response } from 'express'
import { validateRequest } from '../../middleware/setUpValidationMiddleware'
import { FieldValidationError } from '../../@types/FieldValidationError'
import paths from '../paths'
import { NonDisclosableInformation } from '../../@types/assessForEarlyReleaseApiClientTypes'
import CommunityOffenderManagerCaseloadService from '../../services/communityOffenderManagerCaseloadService'
import NonDisclosableInformationService from '../../services/nonDisclosableInformationService'

export default class NonDisclosableInformationRoutes {
  constructor(
    private readonly communityOffenderManagerCaseloadService: CommunityOffenderManagerCaseloadService,
    private readonly nonDisclosableInformationService: NonDisclosableInformationService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { prisonNumber } = req.params
    const assessmentSummary = await this.communityOffenderManagerCaseloadService.getAssessmentOverviewSummary(
      req?.middleware?.clientToken,
      res.locals.agent,
      prisonNumber,
    )

    res.render('pages/communityOffenderManager/nonDisclosableInformation', {
      assessmentSummary: {
        ...assessmentSummary,
        hasNonDisclosableInformation: assessmentSummary.hasNonDisclosableInformation ? 'yes' : 'no',
      },
      prisonNumber,
    })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    const { prisonNumber } = req.params
    const { hasNonDisclosableInformation, nonDisclosableInformation } = req.body
    const { forename } = await this.communityOffenderManagerCaseloadService.getAssessmentOverviewSummary(
      req?.middleware?.clientToken,
      res.locals.agent,
      prisonNumber,
    )

    validateRequest(req, () => {
      const validationErrors: FieldValidationError[] = []

      if (hasNonDisclosableInformation === 'yes' && !nonDisclosableInformation) {
        validationErrors.push({ field: 'nonDisclosableInformation', message: 'Enter non-disclosable information' })
      }

      if (!hasNonDisclosableInformation) {
        validationErrors.push({
          field: 'hasNonDisclosableInformation',
          message: `Please select whether you need to enter any information that must not be disclosed to ${forename}`,
        })
      }

      return validationErrors
    })

    await this.nonDisclosableInformationService.recordNonDisclosableInformation(
      req?.middleware?.clientToken,
      res.locals.agent,
      prisonNumber,
      {
        hasNonDisclosableInformation: hasNonDisclosableInformation === 'yes',
        nonDisclosableInformation: hasNonDisclosableInformation === 'yes' ? nonDisclosableInformation : null,
      } as NonDisclosableInformation,
    )

    return res.redirect(paths.probation.assessment.home({ prisonNumber: req.params.prisonNumber }))
  }
}
