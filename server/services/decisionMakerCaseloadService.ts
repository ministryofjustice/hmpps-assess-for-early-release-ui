import type { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import { convertToTitleCase } from '../utils/utils'
import { Agent, AssessmentSummary } from '../@types/assessForEarlyReleaseApiClientTypes'

export type Case = {
  name: string
  prisonNumber: string
  hdced: Date
  workingDaysToHdced: number
}

export default class DecisionMakerCaseloadService {
  constructor(
    private readonly assessForEarlyReleaseApiClientBuilder: RestClientBuilder<AssessForEarlyReleaseApiClient>,
  ) {}

  public async getDecisionMakerCaseload(token: string, agent: Agent, prisonCode: string): Promise<Case[]> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token, agent)
    const result = await assessForEarlyReleaseApiClient.getDecisionMakerCaseload(prisonCode)
    return result.map(offender => ({
      name: convertToTitleCase(`${offender.forename} ${offender.surname}`.trim()),
      prisonNumber: offender.prisonNumber,
      hdced: offender.hdced,
      workingDaysToHdced: offender.workingDaysToHdced,
    }))
  }

  public async getAssessmentSummary(token: string, agent: Agent, prisonNumber: string): Promise<AssessmentSummary> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token, agent)
    return assessForEarlyReleaseApiClient.getAssessmentSummary(prisonNumber)
  }
}
