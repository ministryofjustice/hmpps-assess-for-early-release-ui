import type { Request, Response } from 'express'
import { AddressService, ResidentialChecksService } from '../../../services'
import { validateRequest } from '../../../middleware/setUpValidationMiddleware'
import { FieldValidationError } from '../../../@types/FieldValidationError'

export default class ResidentialChecksTaskRoutes {
  constructor(
    private readonly addressService: AddressService,
    private readonly residentialChecksService: ResidentialChecksService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const defaultTemplate = 'residentialChecksTask'
    const taskTemplateOverrides: Record<string, string> = {
      'address-details-and-informed-consent': 'address-details-and-informed-consent',
      'make-a-risk-management-decision': 'make-a-risk-management-decision',
    }
    const { checkRequestId, prisonNumber, taskCode } = req.params

    const task = await this.residentialChecksService.getResidentialChecksTask(
      req?.middleware?.clientToken,
      prisonNumber,
      Number(checkRequestId),
      taskCode,
    )

    const addressCheckRequest = await this.addressService.getStandardAddressCheckRequest(
      req?.middleware?.clientToken,
      prisonNumber,
      Number(checkRequestId),
    )

    const templateToRender = taskTemplateOverrides[taskCode] || defaultTemplate
    res.render(`pages/communityOffenderManager/residentialChecks/tasks/${templateToRender}`, {
      prisonNumber,
      task: task.taskConfig,
      addressCheckRequest,
    })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    validateRequest(req, () => {
      const validationErrors: FieldValidationError[] = []
      return validationErrors
    })
  }
}
