import type {
  CriterionProgress,
  CriterionView,
  EligibilityAndSuitabilityCaseView,
} from '../@types/assessForEarlyReleaseApiClientTypes'
import type { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'

import logger from '../../logger'

export default class EligibilityAndSuitabilityService {
  constructor(
    private readonly assessForEarlyReleaseApiClientBuilder: RestClientBuilder<AssessForEarlyReleaseApiClient>,
  ) {}

  public async getCriteria(token: string, prisonNumber: string): Promise<EligibilityAndSuitabilityCaseView> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.getEligibilityCriteriaView(prisonNumber)
  }

  public async getCriterion(
    token: string,
    prisonNumber: string,
    type: 'eligibility-check' | 'suitability-check',
    checkCode: string,
  ): Promise<CriterionView> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)

    if (type === 'eligibility-check') {
      return assessForEarlyReleaseApiClient.getEligibilityCriterionView(prisonNumber, checkCode)
    }

    if (type === 'suitability-check') {
      return assessForEarlyReleaseApiClient.getSuitabilityCriterionView(prisonNumber, checkCode)
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
    }: {
      prisonNumber: string
      type: 'suitability' | 'eligibility'
      criterion: CriterionProgress
      form: Record<string, unknown>
    },
  ) {
    const payload = this.sanitiseForm(criterion, form)
    logger.info('save check called', prisonNumber, type, criterion.code)
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.submitAnswer(prisonNumber, {
      type,
      code: criterion.code,
      answers: payload,
    })
  }

  sanitiseForm(check: CriterionProgress, form: Record<string, unknown>): Record<string, boolean> {
    return Object.fromEntries(check.questions.map(question => [question.name, form[question.name] === 'true']))
  }
}
