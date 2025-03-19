import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import { convertToTitleCase } from '../utils/utils'
import { ProbationUser } from '../interfaces/hmppsUser'
import { Agent, AssessmentSummary } from '../@types/assessForEarlyReleaseApiClientTypes'

export type Case = {
  name: string
  prisonNumber: string
  probationPractitioner: string
  hdced: Date
  workingDaysToHdced: number
}

export default class CommunityOffenderManagerCaseloadService {
  constructor(private readonly assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient) {}

  public async getCommunityOffenderManagerCaseload(token: string, agent: Agent, user: ProbationUser): Promise<Case[]> {
    const result = await this.assessForEarlyReleaseApiClient.getCommunityOffenderManagerCaseload(
      token,
      agent,
      user.deliusStaffCode,
    )
    return result.map(offender => ({
      name: convertToTitleCase(`${offender.forename} ${offender.surname}`.trim()),
      prisonNumber: offender.prisonNumber,
      probationPractitioner: offender.probationPractitioner,
      hdced: offender.hdced,
      workingDaysToHdced: offender.workingDaysToHdced,
    }))
  }

  public async getAssessmentOverviewSummary(
    token: string,
    agent: Agent,
    prisonNumber: string,
  ): Promise<AssessmentSummary> {
    return this.assessForEarlyReleaseApiClient.getAssessmentOverviewSummary(token, agent, prisonNumber)
  }
}
