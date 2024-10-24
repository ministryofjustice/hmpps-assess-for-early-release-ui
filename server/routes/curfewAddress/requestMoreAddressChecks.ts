import { Request, Response } from 'express'
import { AddressService, CaseAdminCaseloadService } from '../../services'
import { convertToTitleCase } from '../../utils/utils'
import { validateRequest } from '../../middleware/setUpValidationMiddleware'
import paths from '../paths'

export default class RequestMoreAddressChecksRoutes {
  constructor(
    private readonly addressService: AddressService,
    private readonly caseAdminCaseloadService: CaseAdminCaseloadService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { checkRequestId, prisonNumber } = req.params
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentSummary(
      req?.middleware?.clientToken,
      prisonNumber,
    )
    const addressSummary = await this.addressService.getStandardAddressCheckRequest(
      req?.middleware?.clientToken,
      prisonNumber,
      Number(checkRequestId),
    )
    console.log('addressSummary', addressSummary)
    res.render('pages/curfewAddress/requestMoreAddressChecks', {
      assessmentSummary: {
        ...assessmentSummary,
        name: convertToTitleCase(`${assessmentSummary.forename} ${assessmentSummary.surname}`.trim()),
      },
      prisonNumber,
      addresses: [
        { name: 'test1', preferencePriority: 'FIRST', checkRequestId: '7' },
        { name: 'test2', preferencePriority: 'SECOND', requestId: 6 },
      ],
    })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    const validationMessage = 'Please select whether you need to enter any more information'
    validateRequest(req, body => {
      return body.moreInfoRequiredCheck ? [] : [{ field: 'moreInfoRequiredCheck', message: validationMessage }]
    })

    if (req.body.moreInfoRequiredCheck === 'no') {
      return res.redirect(
        paths.prison.assessment.curfewAddress.requestMoreAddressChecks({
          prisonNumber: req.params.prisonNumber,
          checkRequestId: req.params.checkRequestId,
        }),
      )
    }

    return res.redirect(
      paths.prison.assessment.curfewAddress.moreInformationRequired({
        prisonNumber: req.params.prisonNumber,
        checkRequestId: req.params.checkRequestId,
      }),
    )
  }

  DELETE = async (req: Request, res: Response): Promise<void> => {
    const { checkRequestId, prisonNumber } = req.params
    await this.addressService.deleteAddressCheckRequest(
      req?.middleware?.clientToken,
      prisonNumber,
      Number(checkRequestId),
    )

    return res.redirect(
      paths.prison.assessment.curfewAddress.requestMoreAddressChecks({
        prisonNumber: req.params.prisonNumber,
        checkRequestId: req.params.checkRequestId,
      }),
    )
  }
}
