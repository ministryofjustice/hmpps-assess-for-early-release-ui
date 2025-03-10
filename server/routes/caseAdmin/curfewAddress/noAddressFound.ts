import { Request, Response } from 'express'
import { convertToTitleCase } from '../../../utils/utils'
import paths from '../../paths'
import { CaseAdminCaseloadService } from '../../../services'

export default class NoAddressFoundRoutes {
  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentSummary(
      req?.middleware?.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )

    res.render('pages/curfewAddress/noAddressFound', {
      assessmentSummary: {
        ...assessmentSummary,
        name: convertToTitleCase(`${assessmentSummary.forename} ${assessmentSummary.surname}`.trim()),
      },
      postcode: req.params.postcode,
      findAddressUrl: paths.prison.assessment.enterCurfewAddressOrCasArea.findAddress({
        prisonNumber: req.params.prisonNumber,
      }),
    })
  }
}
