import { Request, Response } from 'express'
import CaseAdminCaseloadService from '../../../services/caseAdminCaseloadService'
import AddressDeleteReasonType from '../../../enumeration/AddressDeleteReasonType'
import { validateRequest } from '../../../middleware/setUpValidationMiddleware'
import { FieldValidationError } from '../../../@types/FieldValidationError'
import paths from '../../paths'
import AddressService from '../../../services/addressService'
import { AddressDeleteReason } from '../../../@types/assessForEarlyReleaseApiClientTypes'

export default class AddressDeleteReasonRoutes {
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

    res.render('pages/curfewAddress/addressDeleteReason', { assessmentSummary })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    const { checkRequestId, prisonNumber } = req.params
    const { addressDeleteReasonType, addressDeleteOtherReason } = req.body

    validateRequest(req, () => {
      const validationErrors: FieldValidationError[] = []

      if (addressDeleteReasonType === AddressDeleteReasonType.OTHER_REASON) {
        if (!addressDeleteOtherReason || addressDeleteOtherReason?.trim() === '') {
          validationErrors.push({ field: 'addressDeleteOtherReason', message: 'Enter reason' })
        }
      }

      return validationErrors
    })

    await this.addressService.withdrawAddress(
      req?.middleware?.clientToken,
      res.locals.agent,
      prisonNumber,
      Number(checkRequestId),
      {
        addressDeleteReasonType,
        addressDeleteOtherReason,
      } as AddressDeleteReason,
    )

    return res.redirect(paths.prison.assessment.home({ prisonNumber: req.params.prisonNumber }))
  }
}
