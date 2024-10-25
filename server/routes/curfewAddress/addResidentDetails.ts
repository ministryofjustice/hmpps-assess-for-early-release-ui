import { Request, Response } from 'express'
import { AddressService, CaseAdminCaseloadService } from '../../services'
import { convertToTitleCase } from '../../utils/utils'
import { validateRequest } from '../../middleware/setUpValidationMiddleware'
import { FieldValidationError } from '../../@types/FieldValidationError'
import paths from '../paths'

export default class AddResidentDetailsRoutes {
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

    const requestSummary = await this.addressService.getStandardAddressCheckRequest(
      req?.middleware?.clientToken,
      prisonNumber,
      Number(checkRequestId),
    )

    res.render('pages/curfewAddress/addResidentDetails', {
      assessmentSummary: {
        ...assessmentSummary,
        name: convertToTitleCase(`${assessmentSummary.forename} ${assessmentSummary.surname}`.trim()),
      },
      address: {
        line1: convertToTitleCase(requestSummary.address.firstLine),
        town: convertToTitleCase(requestSummary.address.town),
        postcode: requestSummary.address.postcode,
      },
    })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    const { forename, surname, phoneNumber, relation, dateOfBirth, age } = req.body
    validateRequest(req, () => {
      const validationErrors: FieldValidationError[] = []

      if (!forename) {
        validationErrors.push({ field: 'forename', message: 'Enter a first name' })
      }

      if (!surname) {
        validationErrors.push({ field: 'surname', message: 'Enter a last name' })
      }

      if (!relation) {
        validationErrors.push({ field: 'relation', message: "Enter the resident's relation to the offender" })
      }

      return validationErrors
    })

    const { checkRequestId, prisonNumber } = req.params
    const requestSummary = await this.addressService.getStandardAddressCheckRequest(
      req?.middleware?.clientToken,
      prisonNumber,
      Number(checkRequestId),
    )

    await this.addressService.addResident(req?.middleware?.clientToken, prisonNumber, requestSummary.requestId, {
      forename,
      surname,
      phoneNumber,
      relation,
      dateOfBirth,
      age,
      isMainResident: true,
    })

    return res.redirect(paths.prison.assessment.home({ prisonNumber: req.params.prisonNumber }))
  }
}
