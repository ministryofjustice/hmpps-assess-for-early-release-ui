import type { Request, Response } from 'express'
import { validateRequest } from '../../../middleware/setUpValidationMiddleware'
import paths from '../../paths'
import type { EligibilityAndSuitabilityService } from '../../../services'

export default class CheckRoutes {
  constructor(private readonly eligibilityAndSuitabilityService: EligibilityAndSuitabilityService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { checkCode, type, prisonNumber } = req.params

    const { assessmentSummary, check } = await this.eligibilityAndSuitabilityService.getInitialCheck(
      req?.middleware?.clientToken,
      prisonNumber,
      type as 'eligibility' | 'suitability',
      checkCode,
    )

    res.render('pages/caseAdmin/initialChecks/check', { assessmentSummary, type, check })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    const { checkCode, type, prisonNumber } = req.params

    const { check, nextCheck } = await this.eligibilityAndSuitabilityService.getInitialCheck(
      req?.middleware?.clientToken,
      prisonNumber,
      type as 'eligibility' | 'suitability',
      checkCode,
    )

    validateRequest(req, body =>
      check.questions.flatMap(question => {
        const value = body?.[question.name]
        const missingValue = value === undefined || (value !== 'true' && value !== 'false')
        return missingValue ? [{ field: question.name, message: question.text }] : []
      }),
    )

    await this.eligibilityAndSuitabilityService.saveInitialCheckAnswer(req?.middleware?.clientToken, {
      prisonNumber,
      type,
      check,
      form: req.body,
    })

    const nextLocation = nextCheck
      ? paths.prison.assessment.initialChecks.check({ prisonNumber, type, checkCode: nextCheck?.code })
      : paths.prison.assessment.initialChecks.tasklist({ prisonNumber })

    res.redirect(nextLocation)
  }
}
