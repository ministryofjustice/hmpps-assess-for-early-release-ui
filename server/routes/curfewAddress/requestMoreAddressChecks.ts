import { Request, Response } from 'express'
import { AddressService, CaseAdminCaseloadService } from '../../services'
import { validateRequest } from '../../middleware/setUpValidationMiddleware'
import paths from '../paths'

export default class RequestMoreAddressChecksRoutes {
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
    const addressSummary = await this.addressService.getCheckRequestsForAssessment(
      req?.middleware?.clientToken,
      prisonNumber,
    )

    res.render('pages/curfewAddress/requestMoreAddressChecks', {
      assessmentSummary,
      addressSummary,
    })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    const { prisonNumber } = req.params

    const validationMessage = 'Please select whether you need to enter any more information'
    validateRequest(req, body => {
      return body.moreAddressChecks ? [] : [{ field: 'moreAddressChecks', message: validationMessage }]
    })

    if (req.body.moreAddressChecks === 'no') {
      return res.redirect(paths.prison.assessment.curfewAddress.checkYourAnswers({ prisonNumber }))
    }

    return res.redirect(paths.prison.assessment.curfewAddress.findAddress({ prisonNumber }))
  }

  DELETE = async (req: Request, res: Response): Promise<void> => {
    const { checkRequestId, prisonNumber } = req.params
    await this.addressService.deleteAddressCheckRequest(
      req?.middleware?.clientToken,
      prisonNumber,
      Number(checkRequestId),
    )

    return res.redirect(paths.prison.assessment.curfewAddress.requestMoreAddressChecks({ prisonNumber }))
  }

  // private toAddressView(addressSummary: CheckRequestSummary[]) {
  //   return addressSummary.map(a => {
  //     return {
  //       ...a,
  //       requestId: a.requestId.toString(),
  //       address: {
  //         firstLine: a.address.firstLine,
  //         secondLine: a.address.secondLine,
  //         town: a.address.town,
  //         postcode: a.address.postcode,
  //       },
  //     }
  //   })
  // }
}
