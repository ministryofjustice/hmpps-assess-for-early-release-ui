import { Request, Response } from 'express'
import { CaseAdminCaseloadService } from '../../../services'

export default class TasklistRoutes {
  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const initialChecks = await this.caseAdminCaseloadService.getInitialChecks(
      req?.middleware?.clientToken,
      req.params.prisonNumber,
    )
    res.render('pages/caseAdmin/initialChecks/tasklist', { initialChecks })
  }
}
