import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import { convertToTitleCase } from '../utils/utils'
import { Agent, AssessmentOverviewSummary } from '../@types/assessForEarlyReleaseApiClientTypes'

export type Case = {
  name: string
  prisonNumber: string
  hdced: Date
  workingDaysToHdced: number
}

export default class DecisionMakerCaseloadService {
  constructor(private readonly assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient) {}

  public async getDecisionMakerCaseload(token: string, agent: Agent, prisonCode: string): Promise<Case[]> {
    const result = await this.assessForEarlyReleaseApiClient.getDecisionMakerCaseload(token, agent, prisonCode)
    return result.map(offender => ({
      name: convertToTitleCase(`${offender.forename} ${offender.surname}`.trim()),
      prisonNumber: offender.prisonNumber,
      hdced: offender.hdced,
      workingDaysToHdced: offender.workingDaysToHdced,
    }))
  }

  public async getAssessmentOverviewSummary(
    token: string,
    agent: Agent,
    prisonNumber: string,
  ): Promise<AssessmentOverviewSummary> {
    return this.assessForEarlyReleaseApiClient.getAssessmentOverviewSummary(token, agent, prisonNumber)
  }
}
