import { Request, Response } from 'express'
import { differenceInDays } from 'date-fns'
import CaseAdminCaseloadService from '../../../services/caseAdminCaseloadService'
import { convertToTitleCase, parseDate } from '../../../utils/utils'

export default class CaseloadRoutes {
  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const offenders = await this.caseAdminCaseloadService.getCaseAdminCaseload(req.middleware.clientToken, 'MDI')

    const caseload = offenders.map(o => {
      return {
        name: convertToTitleCase(`${o.firstName} ${o.lastName}`.trim()),
        prisonerNumber: o.prisonerNumber,
        hdced: o?.hdced,
        remainingDays: differenceInDays(parseDate(o?.hdced), new Date()),
      }
    })
    res.render('pages/caseAdmin/caseload', { caseload })
  }
}
