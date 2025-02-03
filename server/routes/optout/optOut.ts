import { Request, Response } from 'express'
import { CaseAdminCaseloadService } from '../../services'
import { convertToTitleCase } from '../../utils/utils'
import OptOutReasonType from '../../enumeration/optOutReasonType'
import { FieldValidationError } from '../../@types/FieldValidationError'
import OptOutService from '../../services/optOutService'
import paths from '../paths'
import { validateRequest } from '../../middleware/setUpValidationMiddleware'
import { Agent } from '../../@types/assessForEarlyReleaseApiClientTypes'

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

      if (!body.optOutReasonType) {
        validationErrors.push({ field: 'optOutReasonType', message: 'Select an opt-out reason' })
      }

      if (body.optOutReasonType === OptOutReasonType.OTHER && !body.otherReason) {
        validationErrors.push({ field: 'otherReason', message: 'Enter the reason for opting out' })
      }

      return validationErrors
    })

    const { optOutReasonType, otherReason } = req.body
    const { user } = res.locals

    const agent: Agent = {
      username: user.username,
      role: 'PRISON_CA',
      onBehalfOf: res.locals.activeCaseLoadId,
    }

    await this.optOutService.optOut(req?.middleware?.clientToken, req.params.prisonNumber, {
      optOutReasonType,
      otherReason,
      agent,
    })
    return res.redirect(paths.prison.assessment.home({ prisonNumber: req.params.prisonNumber }))
  }
}
