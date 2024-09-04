import { Request, Response } from 'express'
import CaseAdminCaseloadService from '../../../services/caseAdminCaseloadService'

export default class CaseloadRoutes {
  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    res.render('pages/caseAdmin/caseload')
  }
}
