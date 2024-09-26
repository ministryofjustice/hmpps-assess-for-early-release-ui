import type { Request, Response } from 'express'
import type { EligibilityAndSuitabilityService } from '../../../services'

export default class TasklistRoutes {
  constructor(private readonly eligibilityAndSuitabilityService: EligibilityAndSuitabilityService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const initialChecks = await this.eligibilityAndSuitabilityService.getInitialChecks(
      req?.middleware?.clientToken,
      req.params.prisonNumber,
    )
    res.render('pages/caseAdmin/initialChecks/tasklist', { initialChecks })
  }
}