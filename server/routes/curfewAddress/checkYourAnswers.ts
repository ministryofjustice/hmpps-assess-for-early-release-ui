import { Request, Response } from 'express'
import { AddressService, CaseAdminCaseloadService } from '../../services'
import paths from '../paths'

export default class CheckYourAnswersRoutes {
  constructor(
    private readonly addressService: AddressService,
    private readonly caseAdminCaseloadService: CaseAdminCaseloadService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { prisonNumber } = req.params
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentSummary(
      req?.middleware?.clientToken,
      prisonNumber,
    )
    const checkRequestsForassessmentSummary = await this.addressService.getCheckRequestsForAssessment(
      req?.middleware?.clientToken,
      prisonNumber,
    )

    res.render('pages/curfewAddress/checkYourAnswers', {
      assessmentSummary,
      checkRequestsForassessmentSummary,
    })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    const { prisonNumber } = req.params
    await this.addressService.submitAssessmentForAddressChecks(req?.middleware?.clientToken, prisonNumber)

    return res.redirect(paths.prison.assessment.home({ prisonNumber }))
  }

  DELETE = async (req: Request, res: Response): Promise<void> => {
    const { checkRequestId, prisonNumber } = req.params
    await this.addressService.deleteAddressCheckRequest(
      req?.middleware?.clientToken,
      prisonNumber,
      Number(checkRequestId),
    )

    const checkRequestsForassessmentSummary = await this.addressService.getCheckRequestsForAssessment(
      req?.middleware?.clientToken,
      prisonNumber,
    )

    if (checkRequestsForassessmentSummary.length > 0) {
      return res.redirect(paths.prison.assessment.curfewAddress.checkYourAnswers({ prisonNumber }))
    }

    return res.redirect(paths.prison.assessment.home({ prisonNumber }))
  }
}