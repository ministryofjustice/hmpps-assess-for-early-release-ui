import type { Request, Response } from 'express'
import type { EligibilityAndSuitabilityService } from '../../../services'

export default class TasklistRoutes {
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

    res.render('pages/caseAdmin/initialChecks/tasklist', {
      criteria,
      totalChecks,
      completedChecks: completedEligibilityChecks + completedSuitabilityChecks,
    })
  }
}
