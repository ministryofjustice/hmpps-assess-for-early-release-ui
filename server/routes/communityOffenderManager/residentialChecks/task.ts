import type { Request, Response } from 'express'
import { AddressService, ResidentialChecksService } from '../../../services'
import { validateRequest } from '../../../middleware/setUpValidationMiddleware'
import { FieldValidationError } from '../../../@types/FieldValidationError'
import {
  MapStringAny,
  SaveResidentialChecksTaskAnswersRequest,
} from '../../../@types/assessForEarlyReleaseApiClientTypes'
import paths from '../../paths'
import { ProblemDetail } from '../../../@types/ProblemDetail'
import getFormDate from '../../../utils/dateUtils'

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
    const { checkRequestId, prisonNumber, taskCode } = req.params

    const task = await this.residentialChecksService.getResidentialChecksTask(
      req?.middleware?.clientToken,
      prisonNumber,
      Number(checkRequestId),
      taskCode,
    )

    const answers: MapStringAny = {}
    for (const section of task.taskConfig.sections) {
      for (const question of section.questions) {
        const { input } = question
        if (question.input.type === 'DATE') {
          answers[question.input.name] = getFormDate(input.name, req.body)
        } else if (question.input.dataType === 'BOOLEAN') {
          const answer = req.body[input.name]
          if (answer) {
            const formValue = (answer as string)?.toLowerCase()
            answers[question.input.name] = formValue === 'yes' || formValue === 'true'
          }
        } else {
          answers[input.name] = req.body[input.name]
        }
      }
    }

    const saveAnswersRequest: SaveResidentialChecksTaskAnswersRequest = {
      taskCode,
      answers,
    }

    let problemDetail: ProblemDetail
    try {
      await this.residentialChecksService.saveResidentialChecksTaskAnswers(
        req?.middleware?.clientToken,
        prisonNumber,
        Number(checkRequestId),
        saveAnswersRequest,
      )
    } catch (error) {
      if (error.status === 400) {
        problemDetail = error.data as ProblemDetail
      }
    }

    validateRequest(req, () => {
      if (!problemDetail) {
        return []
      }
      const validationErrors: FieldValidationError[] = []
      for (const section of task.taskConfig.sections) {
        for (const question of section.questions) {
          if (problemDetail[question.input.name]) {
            validationErrors.push({
              field: question.input.name,
              message: problemDetail[question.input.name] as string,
            })
          }
          answers[question.input.name] = req.body[question.input.name]
        }
      }

      return validationErrors
    })

    return res.redirect(
      paths.probation.assessment.curfewAddress.addressCheckTasklist({
        prisonNumber: req.params.prisonNumber,
        checkRequestId,
      }),
    )
  }
}
