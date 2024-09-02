import { Request, Response } from 'express'
import AssessCaseloadService from '../../../services/assessCaseloadService'

export default class CaseloadRoutes {
  constructor(private readonly assessCaseloadService: AssessCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { user } = res.locals
    const caseload = await this.assessCaseloadService.getAssessCaseload(user)
    res.render('pages/assessingLicences/caseload', {
      caseload,
    })
  }
}
