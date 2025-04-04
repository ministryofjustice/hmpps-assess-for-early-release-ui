import type {
  Agent,
  CriterionProgress,
  CriterionView,
  EligibilityAndSuitabilityCaseView,
} from '../@types/assessForEarlyReleaseApiClientTypes'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'

import logger from '../../logger'

export default class EligibilityAndSuitabilityService {
  constructor(private readonly assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient) {}

  public async getCriteria(
    token: string,
    agent: Agent,
    prisonNumber: string,
  ): Promise<EligibilityAndSuitabilityCaseView> {
    return this.assessForEarlyReleaseApiClient.getEligibilityCriteriaView(token, agent, prisonNumber)
  }

  public async getCriterion(
    token: string,
    prisonNumber: string,
    type: 'eligibility-check' | 'suitability-check',
    checkCode: string,
    agent?: Agent,
  ): Promise<CriterionView> {
    if (type === 'eligibility-check') {
      return this.assessForEarlyReleaseApiClient.getEligibilityCriterionView(token, agent, prisonNumber, checkCode)
    }

    if (type === 'suitability-check') {
      return this.assessForEarlyReleaseApiClient.getSuitabilityCriterionView(token, agent, prisonNumber, checkCode)
    }
    throw new Error(`Unknown type: ${type}`)
  }

  public async saveCriterionAnswers(
    token: string,
    {
      prisonNumber,
      type,
      criterion,
      form,
      agent,
    }: {
      prisonNumber: string
      agent: Agent
      type: 'suitability' | 'eligibility'
      criterion: CriterionProgress
      form: Record<string, unknown>
    },
  ): Promise<EligibilityAndSuitabilityCaseView> {
    const payload = this.sanitiseForm(criterion, form)
    logger.info('save check called', prisonNumber, type, criterion.code)
    return this.assessForEarlyReleaseApiClient.submitAnswer(token, agent, prisonNumber, {
      type,
      code: criterion.code,
      answers: payload,
      agent,
    })
  }

  sanitiseForm(check: CriterionProgress, form: Record<string, unknown>): Record<string, boolean> {
    return Object.fromEntries(check.questions.map(question => [question.name, form[question.name] === 'true']))
  }
}
