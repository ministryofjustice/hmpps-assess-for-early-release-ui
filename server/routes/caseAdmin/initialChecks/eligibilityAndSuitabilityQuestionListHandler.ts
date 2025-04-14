import type { Request, Response } from 'express'
import type { EligibilityAndSuitabilityService } from '../../../services'
import { convertToTitleCase } from '../../../utils/utils'

export default class EligibilityAndSuitabilityQuestionListHandler {
  constructor(private readonly eligibilityAndSuitabilityService: EligibilityAndSuitabilityService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const criteria = await this.eligibilityAndSuitabilityService.getCriteria(
      req?.middleware?.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )

    const totalChecks = criteria.eligibility.length + criteria.suitability.length
    const completedEligibilityChecks = criteria.eligibility.filter(
      criterion => criterion.status !== 'NOT_STARTED' && criterion.status !== 'IN_PROGRESS',
    ).length
    const completedSuitabilityChecks = criteria.suitability.filter(
      criterion => criterion.status !== 'NOT_STARTED' && criterion.status !== 'IN_PROGRESS',
    ).length

    const allChecks = [...criteria.eligibility, ...criteria.suitability]

    let lastCompletedEligibilityCheck = null
    if (allChecks.length > 0) {
      lastCompletedEligibilityCheck = allChecks.reduce((prev, current) => {
        return prev.lastUpdated > current.lastUpdated ? prev : current
      })
    }

    res.render('pages/caseAdmin/initialChecks/eligibilityAndSuitabilityQuestionList', {
      criteria,
      totalChecks,
      completedChecks: completedEligibilityChecks + completedSuitabilityChecks,
      completedBy: convertToTitleCase(lastCompletedEligibilityCheck?.agent?.fullName),
      completedAt: lastCompletedEligibilityCheck?.agent?.onBehalfOf,
      completedOn: lastCompletedEligibilityCheck?.lastUpdated,
    })
  }
}
