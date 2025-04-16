import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import { convertToTitleCase } from '../utils/utils'
import { ProbationUser } from '../interfaces/hmppsUser'
import { Agent, AssessmentOverviewSummary } from '../@types/assessForEarlyReleaseApiClientTypes'
import AssessmentStatus from '../enumeration/assessmentStatus'

export type Case = {
  name: string
  crn?: string
  prisonNumber: string
  probationPractitioner: string
  hdced: Date
  workingDaysToHdced: number
  status: AssessmentStatus
  currentTask?: string
}

export default class CommunityOffenderManagerCaseloadService {
  constructor(private readonly assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient) {}

  public async getCommunityOffenderManagerCaseload(token: string, agent: Agent, user: ProbationUser): Promise<Case[]> {
    const result = await this.assessForEarlyReleaseApiClient.getCommunityOffenderManagerCaseload(
      token,
      agent,
      user.deliusStaffCode,
    )
    return result.map(aCase => ({
      name: convertToTitleCase(`${aCase.forename} ${aCase.surname}`.trim()),
      crn: aCase.crn,
      prisonNumber: aCase.prisonNumber,
      probationPractitioner: aCase.probationPractitioner,
      crd: aCase.crd,
      hdced: aCase.hdced,
      workingDaysToHdced: aCase.workingDaysToHdced,
      status: aCase.status as AssessmentStatus,
      currentTask: aCase.currentTask,
      postponementReasons: aCase.postponementReasons,
      postponementDate: aCase.postponementDate,
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
