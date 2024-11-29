import type { Request, Response } from 'express'
import { AddressService, ResidentialChecksService } from '../../../services'

export default class ResidentialChecksTasklistRoutes {
  constructor(
    private readonly addressService: AddressService,
    private readonly residentialChecksService: ResidentialChecksService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { checkRequestId, prisonNumber } = req.params

    const addressCheckRequest = await this.addressService.getStandardAddressCheckRequest(
      req?.middleware?.clientToken,
      prisonNumber,
      Number(checkRequestId),
    )

    const residentialChecksView = await this.residentialChecksService.getResidentialChecksView(
      req?.middleware?.clientToken,
      prisonNumber,
      Number(checkRequestId),
    )

    res.render('pages/communityOffenderManager/residentialChecks/tasklist', {
      addressCheckRequest,
      residentialChecksView,
    })
  }
}
