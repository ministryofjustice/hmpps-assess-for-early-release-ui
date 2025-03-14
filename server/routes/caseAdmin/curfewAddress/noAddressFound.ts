import { Request, Response } from 'express'
import paths from '../../paths'
import { CaseAdminCaseloadService } from '../../../services'

export default class NoAddressFoundRoutes {
  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentOverviewSummary(
      req?.middleware?.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )

    res.render('pages/curfewAddress/noAddressFound', {
      assessmentSummary,
      postcode: req.params.postcode,
      findAddressUrl: paths.prison.assessment.enterCurfewAddressOrCasArea.findAddress({
        prisonNumber: req.params.prisonNumber,
      }),
    })
  }
}
