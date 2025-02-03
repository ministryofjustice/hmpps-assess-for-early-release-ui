import type { Request, Response } from 'express'
import { AddressService, ResidentialChecksService } from '../../../services'
import { validateRequest } from '../../../middleware/setUpValidationMiddleware'
import { FieldValidationError } from '../../../@types/FieldValidationError'
import {
  MapStringAny,
  ProblemDetail,
  SaveResidentialChecksTaskAnswersRequest,
} from '../../../@types/assessForEarlyReleaseApiClientTypes'
import paths from '../../paths'
import { getFormDate, toFormDate } from '../../../utils/dateUtils'

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

    let answers: { [key: string]: string } = {}
    for (const section of task.taskConfig.sections) {
      for (const question of section.questions) {
        const { input } = question
        const answer = task.answers[input.name]
        if (answer !== undefined && answer !== null) {
          if (input.type === 'DATE') {
            answers = {
              ...answers,
              ...toFormDate(input.name, answer as string),
            }
          } else {
            answers[input.name] = `${answer}`
          }
        }
      }
    }

    const templateToRender = taskTemplateOverrides[taskCode] || defaultTemplate
    res.render(`pages/communityOffenderManager/residentialChecks/tasks/${templateToRender}`, {
      prisonNumber,
      task: task.taskConfig,
      addressCheckRequest,
      answers,
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
        } else {
          answers[input.name] = req.body[input.name]
        }
      }
    }

    const { user } = res.locals
    const saveAnswersRequest: SaveResidentialChecksTaskAnswersRequest = {
      taskCode,
      answers,
      agent: {
        username: user.username,
        role: 'PROBATION_COM',
        onBehalfOf: task.assessmentSummary.responsibleCom.team,
      },
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
