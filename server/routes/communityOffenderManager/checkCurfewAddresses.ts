import { Request, Response } from 'express'
import { AddressService, CaseAdminCaseloadService } from '../../services'

export default class CheckCurfewAddressesRoutes {
  constructor(
    private readonly addressService: AddressService,
    private readonly caseAdminCaseloadService: CaseAdminCaseloadService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { prisonNumber } = req.params
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentOverviewSummary(
      req?.middleware?.clientToken,
      res.locals.agent,
      prisonNumber,
    )
    const checkRequestsForAssessmentSummary = await this.addressService.getCheckRequestsForAssessment(
      req?.middleware?.clientToken,
      res.locals.agent,
      prisonNumber,
    )

    res.render('pages/curfewAddress/checkCurfewAddresses', {
      assessmentSummary,
      prisonNumber,
      checkRequestsForAssessmentSummary,
    })
  }
}
