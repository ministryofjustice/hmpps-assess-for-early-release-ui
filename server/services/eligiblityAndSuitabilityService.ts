import assert from 'assert'
import type { Check, InitialChecks } from '../@types/assessForEarlyReleaseApiClientTypes'
import type { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'

import logger from '../../logger'

export default class EligibilityAndSuitabilityService {
  constructor(
    private readonly assessForEarlyReleaseApiClientBuilder: RestClientBuilder<AssessForEarlyReleaseApiClient>,
  ) {}

  public async getInitialChecks(token: string, prisonNumber: string): Promise<InitialChecks> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.getInitialCheckStatus(prisonNumber)
  }

  public async getInitialCheck(
    token: string,
    prisonNumber: string,
    type: 'eligibility' | 'suitability',
    checkCode: string,
  ) {
    const initialChecks = await this.getInitialChecks(token, prisonNumber)
    const checks = type === 'eligibility' ? initialChecks.eligibility : initialChecks.suitability
    const checkIndex = checks.findIndex(q => q.code === checkCode)

    assert(checkIndex >= 0, `Could not find check of type: '${type}', code: '${checkCode}'`)
    return {
      assessmentSummary: initialChecks.assessmentSummary,
      check: checks[checkIndex],
      nextCheck: checks[checkIndex + 1],
    }
  }

  public async saveInitialCheckAnswer(
    token: string,
    {
      prisonNumber,
      type,
      check,
      form,
    }: { prisonNumber: string; type: string; check: Check; form: Record<string, unknown> },
  ) {
    const payload = this.sanitiseForm(check, form)
    logger.info('save check called', prisonNumber, type, check, payload)
  }

  sanitiseForm(check: Check, form: Record<string, unknown>): Record<string, boolean> {
    return Object.fromEntries(check.questions.map(question => [question.name, Boolean(form[question.name])]))
  }
}
