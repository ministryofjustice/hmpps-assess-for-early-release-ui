import { Request, Response } from 'express'
import CaseAdminCaseloadService from '../../services/caseAdminCaseloadService'
import paths from '../paths'

export default class CaseloadRoutes {
  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const offenderSummaryList = await this.caseAdminCaseloadService.getCaseAdminCaseload(
      req?.middleware?.clientToken,
      res.locals.activeCaseLoadId,
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
    res.render('pages/caseAdmin/caseload', { caseload })
  }
}
