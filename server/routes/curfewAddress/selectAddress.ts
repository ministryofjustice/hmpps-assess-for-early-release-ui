import { Request, Response } from 'express'
import { CaseAdminCaseloadService } from '../../services'
import { convertToTitleCase } from '../../utils/utils'
import { FieldValidationError } from '../../@types/FieldValidationError'
import paths from '../paths'
import { validateRequest } from '../../middleware/setUpValidationMiddleware'
import AddressService from '../../services/addressService'
import { AddressSummary, Agent } from '../../@types/assessForEarlyReleaseApiClientTypes'

export default class SelectAddressRoutes {
  constructor(
    private readonly addressService: AddressService,
    private readonly caseAdminCaseloadService: CaseAdminCaseloadService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentSummary(
      req?.middleware?.clientToken,
      req.params.prisonNumber,
    )

    const postcode = req.query?.postcode as string
    if (postcode) {
      const addresses = await this.addressService.findAddressesForPostcode(req?.middleware?.clientToken, postcode)
      if (addresses.length === 1) {
        const checkRequestSummary = await this.addressService.addStandardAddressCheckRequest(
          req?.middleware?.clientToken,
          req.params.prisonNumber,
          {
            addStandardAddressCheckRequest: {
              preferencePriority: 'FIRST',
              addressUprn: addresses[0].uprn,
            },
            agent: res.locals.agent,
          },
        )
        return res.redirect(
          paths.prison.assessment.enterCurfewAddressOrCasArea.addResidentDetails({
            prisonNumber: req.params.prisonNumber,
            checkRequestId: checkRequestSummary.requestId.toString(),
          }),
        )
      }
      return res.render('pages/curfewAddress/selectAddress', {
        assessmentSummary: {
          ...assessmentSummary,
          name: convertToTitleCase(`${assessmentSummary.forename} ${assessmentSummary.surname}`.trim()),
        },
        foundAddresses: this.toAddressView(addresses),
        findAddressUrl: paths.prison.assessment.enterCurfewAddressOrCasArea.findAddress({
          prisonNumber: req.params.prisonNumber,
        }),
        formattedPostcode: this.formatPostcode(postcode),
      })
    }

    return res.redirect(
      `${paths.prison.assessment.enterCurfewAddressOrCasArea.findAddress({ prisonNumber: req.params.prisonNumber })}`,
    )
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    validateRequest(req, body => {
      const validationErrors: FieldValidationError[] = []
      const { selectedAddressUprn } = body
      if (!selectedAddressUprn) {
        validationErrors.push({ field: 'selectedAddressUprn', message: 'Select an address' })
      }

      return validationErrors
    })

    const checkRequestSummary = await this.addressService.addStandardAddressCheckRequest(
      req?.middleware?.clientToken,
      req.params.prisonNumber,
      {
        addStandardAddressCheckRequest: {
          preferencePriority: 'FIRST',
          addressUprn: req.body.selectedAddressUprn,
        },
        agent: res.locals.agent,
      },
    )

    return res.redirect(
      paths.prison.assessment.enterCurfewAddressOrCasArea.addResidentDetails({
        prisonNumber: req.params.prisonNumber,
        checkRequestId: checkRequestSummary.requestId.toString(),
      }),
    )
  }

  private toAddressView(addresses: AddressSummary[]) {
    return addresses.map(address => {
      return {
        ...address,
        firstLine: convertToTitleCase(address.firstLine),
        town: convertToTitleCase(address.town),
        postcode: this.formatPostcode(address.postcode),
      }
    })
  }

  private isValidPostcode(postcode: string): boolean {
    const postcodeRegEx = /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i
    return postcodeRegEx.test(postcode)
  }

  private formatPostcode(postcode: string): string {
    if (this.isValidPostcode(postcode)) {
      const postcodeRegEx = /(^[A-Z]{1,2}[0-9]{1,2})([0-9][A-Z]{2}$)/i
      return postcode.replace(postcodeRegEx, '$1 $2').toUpperCase()
    }
    return postcode
  }
}
