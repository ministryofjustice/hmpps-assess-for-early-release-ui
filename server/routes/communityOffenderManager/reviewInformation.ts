import { Request, Response } from 'express'
import { AddressService, ResidentialChecksService } from '../../services'
import {
  ResidentialChecksTaskProgress,
  StandardAddressCheckRequestSummary,
} from '../../@types/assessForEarlyReleaseApiClientTypes'
import { formatDate, parseIsoDate } from '../../utils/utils'

export default class ReviewInformationRoutes {
  constructor(
    private readonly addressService: AddressService,
    private readonly residentialChecksService: ResidentialChecksService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { prisonNumber } = req.params

    const checkRequestsForAssessmentSummary = await this.addressService.getCheckRequestsForAssessment(
      req?.middleware?.clientToken,
      prisonNumber,
    )

    const preferredAddressCheck = checkRequestsForAssessmentSummary.filter(
      summary => summary.requestType === 'STANDARD_ADDRESS' && summary.preferencePriority === 'FIRST',
    )[0] as StandardAddressCheckRequestSummary
    const secondAddressCheck = checkRequestsForAssessmentSummary.filter(
      summary => summary.requestType === 'STANDARD_ADDRESS' && summary.preferencePriority === 'SECOND',
    )[0] as StandardAddressCheckRequestSummary

    const preferredAddressChecksView = await this.residentialChecksService.getResidentialChecksView(
      req?.middleware?.clientToken,
      prisonNumber,
      preferredAddressCheck.requestId,
    )
    const preferredAddressTaskView = this.taskQuestionAnswerView(preferredAddressChecksView.tasks)

    const secondAddressChecksView =
      secondAddressCheck &&
      (await this.residentialChecksService.getResidentialChecksView(
        req?.middleware?.clientToken,
        prisonNumber,
        preferredAddressCheck.requestId,
      ))
    const secondAddressTaskView = secondAddressChecksView && this.taskQuestionAnswerView(secondAddressChecksView.tasks)

    res.render('pages/communityOffenderManager/reviewInformation', {
      prisonNumber,
      preferredAddressCheck,
      preferredAddressTaskView,
      secondAddressCheck,
      secondAddressTaskView,
    })
  }

  taskQuestionAnswerView(tasks: ResidentialChecksTaskProgress[]) {
    return tasks.map(task => ({
      name: task.config.name,
      code: task.config.code,
      status: task.status,
      questionAnswers: task.config.sections.flatMap(section =>
        section.questions.map(question => {
          let answer = task.answers[question.input.name]
          if (answer !== undefined && answer !== null) {
            if (question.input.type === 'RADIO') {
              answer = question.input.options.find(option => option.value === `${answer}`).text
            } else if (question.input.type === 'DATE') {
              answer = formatDate(parseIsoDate(`${answer}`), 'dd MMM yyyy')
            }
          }

          return {
            question: question.text,
            answer,
          }
        }),
      ),
    }))
  }
}
