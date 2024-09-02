import { Request, Response } from 'express'
import DecisionMakerCaseloadService from '../../../services/decisionMakerCaseloadService'

export default class CaseloadRoutes {
  constructor(private readonly decisionMakerCaseloadService: DecisionMakerCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const caseload = await this.decisionMakerCaseloadService.getDecisionMakerCaseload()
    res.render('pages/assessingLicences/caseload', {
      caseload,
    })
  }
}
