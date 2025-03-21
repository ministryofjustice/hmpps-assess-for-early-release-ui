import { Request, Response } from 'express'
import { AddressService, CaseAdminCaseloadService } from '../../../services'
import { validateRequest } from '../../../middleware/setUpValidationMiddleware'
import paths from '../../paths'
import { UpdateCaseAdminAdditionInfoRequest } from '../../../@types/assessForEarlyReleaseApiClientTypes'
import { FieldValidationError } from '../../../@types/FieldValidationError'

export default class MoreInfoRequiredCheckRoutes {
  constructor(
    private readonly caseAdminCaseloadService: CaseAdminCaseloadService,
    private readonly addressService: AddressService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentOverviewSummary(
      req?.middleware?.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )
    res.render('pages/curfewAddress/moreInfoRequiredCheck', {
      assessmentSummary,
    })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    const { moreInfoRequiredCheck, addMoreInfo } = req.body
    validateRequest(req, () => {
      const validationErrors: FieldValidationError[] = []

      if (moreInfoRequiredCheck === 'yes' && !addMoreInfo) {
        validationErrors.push({ field: 'addMoreInfo', message: 'Please enter information' })
      }

      if (!moreInfoRequiredCheck) {
        validationErrors.push({
          field: 'moreInfoRequiredCheck',
          message: 'Please select whether you need to enter any more information',
        })
      }

      return validationErrors
    })

    const { prisonNumber } = req.params
    const requestId = req.params.checkRequestId

    if (req.body.moreInfoRequiredCheck === 'yes') {
      await this.addressService.updateCaseAdminAdditionalInformation(
        req?.middleware?.clientToken,
        res.locals.agent,
        prisonNumber,
        Number(requestId),

        {
          additionalInformation: req.body.addMoreInfo,
        } as UpdateCaseAdminAdditionInfoRequest,
      )
    }

    return res.redirect(
      paths.prison.assessment.enterCurfewAddressOrCasArea.requestMoreAddressChecks({
        prisonNumber,
      }),
    )
  }
}
