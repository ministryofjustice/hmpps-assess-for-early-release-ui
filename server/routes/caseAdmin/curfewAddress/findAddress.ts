import { Request, Response } from 'express'
import { CaseAdminCaseloadService } from '../../../services'
import { FieldValidationError } from '../../../@types/FieldValidationError'
import paths from '../../paths'
import { validateRequest } from '../../../middleware/setUpValidationMiddleware'
import AddressService from '../../../services/addressService'

export default class FindAddressRoutes {
  constructor(
    private readonly addressService: AddressService,
    private readonly caseAdminCaseloadService: CaseAdminCaseloadService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentOverviewSummary(
      req?.middleware?.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )

    res.render('pages/curfewAddress/findAddress', {
      assessmentSummary,
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

    const searchQuery = (req.body.searchQuery as string).replace(/\s+/g, '')
    const addresses = await this.addressService.searchForAddresses(
      req?.middleware?.clientToken,
      res.locals.agent,
      searchQuery,
    )
    if (addresses.length === 0) {
      return res.redirect(
        `${paths.prison.assessment.enterCurfewAddressOrCasArea.noAddressFound({ prisonNumber: req.params.prisonNumber })}?searchQuery=${searchQuery}`,
      )
    }

    return res.redirect(
      `${paths.prison.assessment.enterCurfewAddressOrCasArea.selectAddress({ prisonNumber: req.params.prisonNumber })}?searchQuery=${searchQuery}`,
    )
  }
}
