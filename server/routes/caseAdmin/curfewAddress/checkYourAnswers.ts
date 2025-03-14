import { Request, Response } from 'express'
import { AddressService, CaseAdminCaseloadService } from '../../../services'
import paths from '../../paths'

export default class CheckYourAnswersRoutes {
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

    res.render('pages/curfewAddress/checkYourAnswers', {
      assessmentSummary,
      checkRequestsForAssessmentSummary,
    })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    const { prisonNumber } = req.params

    await this.addressService.submitAssessmentForAddressChecks(
      req?.middleware?.clientToken,
      res.locals.agent,
      prisonNumber,
    )
    return res.redirect(paths.prison.assessment.home({ prisonNumber }))
  }

  DELETE = async (req: Request, res: Response): Promise<void> => {
    const { checkRequestId, prisonNumber } = req.params
    await this.addressService.deleteAddressCheckRequest(
      req?.middleware?.clientToken,
      res.locals.agent,
      prisonNumber,
      Number(checkRequestId),
    )

    const checkRequestsForAssessmentSummary = await this.addressService.getCheckRequestsForAssessment(
      req?.middleware?.clientToken,
      res.locals.agent,
      prisonNumber,
    )

    if (checkRequestsForAssessmentSummary.length > 0) {
      return res.redirect(paths.prison.assessment.enterCurfewAddressOrCasArea.checkYourAnswers({ prisonNumber }))
    }

    return res.redirect(paths.prison.assessment.home({ prisonNumber }))
  }
}
