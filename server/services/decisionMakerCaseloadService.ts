import type { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import { convertToTitleCase } from '../utils/utils'
import { AssessmentSummary } from '../@types/assessForEarlyReleaseApiClientTypes'

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

  public async getDecisionMakerCaseload(token: string, prisonCode: string): Promise<Case[]> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    const result = await assessForEarlyReleaseApiClient.getDecisionMakerCaseload(prisonCode)
    return result.map(offender => ({
      name: convertToTitleCase(`${offender.forename} ${offender.surname}`.trim()),
      prisonNumber: offender.prisonNumber,
      hdced: offender.hdced,
      workingDaysToHdced: offender.workingDaysToHdced,
    }))
  }

  public async getAssessmentSummary(token: string, prisonNumber: string): Promise<AssessmentSummary> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.getAssessmentSummary(prisonNumber)
  }
}
