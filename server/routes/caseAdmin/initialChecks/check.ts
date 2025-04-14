import type { Request, Response } from 'express'
import { validateRequest } from '../../../middleware/setUpValidationMiddleware'
import paths from '../../paths'
import type { EligibilityAndSuitabilityService } from '../../../services'
import {
  EligibilityCriterionProgress,
  EligibilityStatus,
  SuitabilityCriterionProgress,
} from '../../../@types/assessForEarlyReleaseApiClientTypes'

export default class CheckRoutes {
  constructor(private readonly eligibilityAndSuitabilityService: EligibilityAndSuitabilityService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { checkCode, type, prisonNumber } = req.params

    const { criterion, assessmentSummary } = await this.eligibilityAndSuitabilityService.getCriterion(
      req?.middleware?.clientToken,
      prisonNumber,
      type as 'eligibility-check' | 'suitability-check',
      checkCode,
      res.locals.agent,
    )

    res.render('pages/caseAdmin/initialChecks/check', {
      assessmentSummary,
      type,
      criterion,
    })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    const { checkCode, type, prisonNumber } = req.params

    const { criterion, nextCriterion } = await this.eligibilityAndSuitabilityService.getCriterion(
      req?.middleware?.clientToken,
      prisonNumber,
      type as 'eligibility-check' | 'suitability-check',
      checkCode,
      res.locals.agent,
    )

    validateRequest(req, body =>
      criterion.questions.flatMap(question => {
        const value = body?.[question.name]
        const missingValue = value === undefined || (value !== 'true' && value !== 'false')
        return missingValue ? [{ field: question.name, message: question.text }] : []
      }),
    )

    const eligibilityAndSuitabilityCaseView = await this.eligibilityAndSuitabilityService.saveCriterionAnswers(
      req?.middleware?.clientToken,
      {
        prisonNumber,
        type: type.replace('-check', '') as 'eligibility' | 'suitability',
        criterion,
        form: req.body,
        agent: res.locals.agent,
      },
    )

    res.redirect(
      this.getNextPage(prisonNumber, type, req, nextCriterion, eligibilityAndSuitabilityCaseView.overallStatus),
    )
  }

  getNextPage = (
    prisonNumber: string,
    type: string,
    req: Request,
    nextCriterion: EligibilityCriterionProgress | SuitabilityCriterionProgress,
    eligibilityStatus: EligibilityStatus,
  ): string => {
    let nextLocation = paths.prison.assessment.initialChecks.eligibilityAndSuitabilityQuestionList({ prisonNumber })
    if (eligibilityStatus === 'INELIGIBLE' || eligibilityStatus === 'ELIGIBLE') {
      nextLocation = paths.prison.assessment.initialChecks.checksComplete({ prisonNumber })
    } else if (req.body.saveType === 'nextQuestion') {
      nextLocation = nextCriterion
        ? paths.prison.assessment.initialChecks.check({ prisonNumber, type, checkCode: nextCriterion?.code })
        : paths.prison.assessment.initialChecks.eligibilityAndSuitabilityQuestionList({ prisonNumber })
    }
    return nextLocation
  }
}
