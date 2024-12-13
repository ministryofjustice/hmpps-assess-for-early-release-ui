import { Request, Response } from 'express'
import paths from '../paths'
import DecisionMakerCaseloadService from '../../services/decisionMakerCaseloadService'

export default class CaseloadRoutes {
  constructor(private readonly decisionMakerCaseloadService: DecisionMakerCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const offenderSummaryList = await this.decisionMakerCaseloadService.getDecisionMakerCaseload(
      req?.middleware?.clientToken,
      'MDI',
    )

    const caseload = offenderSummaryList.map(offender => {
      return {
        createLink: paths.prison.assessment.home(offender),
        name: offender.name,
        prisonNumber: offender.prisonNumber,
        hdced: offender.hdced,
        remainingDays: offender.remainingDays,
      }
    })
    res.render('pages/decisionMaker/caseload', { caseload })
  }
}
