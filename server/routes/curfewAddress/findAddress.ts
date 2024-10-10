import { Request, Response } from 'express'
import { CaseAdminCaseloadService } from '../../services'
import { convertToTitleCase } from '../../utils/utils'
import { FieldValidationError } from '../../@types/FieldValidationError'
import paths from '../paths'
import { validateRequest } from '../../middleware/setUpValidationMiddleware'
import AddressService from '../../services/addressService'

export default class FindAddressRoutes {
  constructor(
    private readonly addressService: AddressService,
    private readonly caseAdminCaseloadService: CaseAdminCaseloadService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentSummary(
      req?.middleware?.clientToken,
      req.params.prisonNumber,
    )

    res.render('pages/curfewAddress/findAddress', {
      assessmentSummary: {
        ...assessmentSummary,
        name: convertToTitleCase(`${assessmentSummary.forename} ${assessmentSummary.surname}`.trim()),
      },
    })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    validateRequest(req, () => {
      const validationErrors: FieldValidationError[] = []

      if (!req.body.searchQuery) {
        validationErrors.push({ field: 'searchQuery', message: 'Enter an address or postcode' })
      }

      return validationErrors
    })

    const postcode = (req.body.searchQuery as string).replace(/\s+/g, '')
    const addresses = await this.addressService.findAddressesForPostcode(req?.middleware?.clientToken, postcode)
    if (addresses.length === 0) {
      return res.redirect(
        `${paths.prison.assessment.curfewAddress.noAddressFound({ prisonNumber: req.params.prisonNumber })}?postcode=${postcode}`,
      )
    }

    return res.redirect(
      `${paths.prison.assessment.curfewAddress.selectAddress({ prisonNumber: req.params.prisonNumber })}?postcode=${postcode}`,
    )
  }
}
