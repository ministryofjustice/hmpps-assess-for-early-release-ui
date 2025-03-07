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
    res.render('pages/caseAdmin/initialChecks/tasklist', { criteria })
  }
}
