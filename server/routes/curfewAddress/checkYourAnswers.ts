import { Request, Response } from 'express'
import { AddressService, CaseAdminCaseloadService } from '../../services'
import paths from '../paths'
import { Agent } from '../../@types/assessForEarlyReleaseApiClientTypes'

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
    const checkRequestsForAssessmentSummary = await this.addressService.getCheckRequestsForAssessment(
      req?.middleware?.clientToken,
      prisonNumber,
    )

    res.render('pages/curfewAddress/checkYourAnswers', {
      assessmentSummary,
      checkRequestsForAssessmentSummary,
    })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    const { prisonNumber } = req.params
    const agent: Agent = {
      username: res.locals.user.username,
      fullName: res.locals.user.displayName,
      role: 'PRISON_CA',
      onBehalfOf: res.locals.activeCaseLoadId,
    }
    await this.addressService.submitAssessmentForAddressChecks(req?.middleware?.clientToken, prisonNumber, agent)
    return res.redirect(paths.prison.assessment.home({ prisonNumber }))
  }

  DELETE = async (req: Request, res: Response): Promise<void> => {
    const { checkRequestId, prisonNumber } = req.params
    await this.addressService.deleteAddressCheckRequest(
      req?.middleware?.clientToken,
      prisonNumber,
      Number(checkRequestId),
    )

    const checkRequestsForAssessmentSummary = await this.addressService.getCheckRequestsForAssessment(
      req?.middleware?.clientToken,
      prisonNumber,
    )

    if (checkRequestsForAssessmentSummary.length > 0) {
      return res.redirect(paths.prison.assessment.enterCurfewAddressOrCasArea.checkYourAnswers({ prisonNumber }))
    }

    return res.redirect(paths.prison.assessment.home({ prisonNumber }))
  }
}
