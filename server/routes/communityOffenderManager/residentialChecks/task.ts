import type { Request, Response } from 'express'
import { AddressService, ResidentialChecksService } from '../../../services'

export default class ResidentialChecksTaskRoutes {
  constructor(
    private readonly addressService: AddressService,
    private readonly residentialChecksService: ResidentialChecksService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { checkRequestId, prisonNumber, taskCode } = req.params

    const task = await this.residentialChecksService.getResidentialChecksTask(
      req?.middleware?.clientToken,
      prisonNumber,
      Number(checkRequestId),
      taskCode,
    )

    res.render(`pages/communityOffenderManager/residentialChecks/tasks/${taskCode}`, {
      task: task.taskConfig,
    })
  }
}
