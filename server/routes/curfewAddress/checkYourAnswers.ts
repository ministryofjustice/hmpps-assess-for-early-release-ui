import { Request, Response } from 'express'
import { AddressService, CaseAdminCaseloadService } from '../../services'
import { convertToTitleCase } from '../../utils/utils'
import { validateRequest } from '../../middleware/setUpValidationMiddleware'
import { FieldValidationError } from '../../@types/FieldValidationError'
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

    const checkRequestSummaries = await this.addressService.getAddressCheckRequestsForAssessment(
      req?.middleware?.clientToken,
      prisonNumber,
    )
    const standardAddressSummaries = checkRequestSummaries.filter(summary => {
      return summary.requestType === 'STANDARD_ADDRESS'
    })

    const mainAddress = standardAddressSummaries.find(summary => summary.preferencePriority === 'FIRST')
    const secondAddress = standardAddressSummaries.find(summary => summary.preferencePriority === 'SECOND')

    // TODO : going to need a get residents endpoint
    // const residentsMainAddress = this.addressService.

    res.render('pages/curfewAddress/checkYourAnswers', {
      assessmentSummary: {
        ...assessmentSummary,
        name: convertToTitleCase(`${assessmentSummary.forename} ${assessmentSummary.surname}`.trim()),
      },
      mainAddress,
      secondAddress,
    })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    validateRequest(req, () => {
      const validationErrors: FieldValidationError[] = []
      return validationErrors
    })

    return res.redirect(paths.prison.assessment.home({ prisonNumber: req.params.prisonNumber }))
  }
}
