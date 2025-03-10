import type { RestClientBuilder } from '../data'
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
  constructor(
    private readonly assessForEarlyReleaseApiClientBuilder: RestClientBuilder<AssessForEarlyReleaseApiClient>,
  ) {}

  public async getCommunityOffenderManagerCaseload(token: string, agent: Agent, user: ProbationUser): Promise<Case[]> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token, agent)
    const result = await assessForEarlyReleaseApiClient.getCommunityOffenderManagerCaseload(user.deliusStaffCode)
    return result.map(offender => ({
      name: convertToTitleCase(`${offender.forename} ${offender.surname}`.trim()),
      prisonNumber: offender.prisonNumber,
      probationPractitioner: offender.probationPractitioner,
      hdced: offender.hdced,
      workingDaysToHdced: offender.workingDaysToHdced,
    }))
  }

  public async getAssessmentSummary(token: string, agent: Agent, prisonNumber: string): Promise<AssessmentSummary> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token, agent)
    return assessForEarlyReleaseApiClient.getAssessmentSummary(prisonNumber)
  }
}
