import { Request, Response } from 'express'
import { differenceInDays } from 'date-fns'
import CaseAdminCaseloadService from '../../services/caseAdminCaseloadService'
import { convertToTitleCase, parseIsoDate } from '../../utils/utils'

export default class CaseloadRoutes {
  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const offenderSummaryList = await this.caseAdminCaseloadService.getCaseAdminCaseload(
      req?.middleware?.clientToken,
      'MDI',
    )

    const caseload = offenderSummaryList.map(offender => {
      return {
        name: convertToTitleCase(`${offender.firstName} ${offender.lastName}`.trim()),
        prisonerNumber: offender.prisonerNumber,
        hdced: offender.hdced,
        remainingDays: differenceInDays(parseIsoDate(offender.hdced), new Date()),
      }
    })
    res.render('pages/caseAdmin/caseload', { caseload })
  }
}
