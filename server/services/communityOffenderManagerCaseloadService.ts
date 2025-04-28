import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import { convertToTitleCase } from '../utils/utils'
import { ProbationUser } from '../interfaces/hmppsUser'
import { Agent, AssessmentOverviewSummary, OffenderSummary } from '../@types/assessForEarlyReleaseApiClientTypes'
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
  lastUpdateBy?: string
}

export default class CommunityOffenderManagerCaseloadService {
  constructor(private readonly assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient) {}

  public async getCommunityOffenderManagerStaffCaseload(
    token: string,
    agent: Agent,
    user: ProbationUser,
  ): Promise<Case[]> {
    const result = await this.assessForEarlyReleaseApiClient.getCommunityOffenderManagerStaffCaseload(
      token,
      agent,
      user.deliusStaffCode,
    )
    return result.map(offenderSummary => this.mapOffenderSummaryToCase(offenderSummary))
  }

  public async getCommunityOffenderManagerTeamCaseload(
    token: string,
    agent: Agent,
    user: ProbationUser,
  ): Promise<Case[]> {
    const result = await this.assessForEarlyReleaseApiClient.getCommunityOffenderManagerTeamCaseload(
      token,
      agent,
      user.deliusStaffCode,
    )
    return result.map(offenderSummary => this.mapOffenderSummaryToCase(offenderSummary))
  }

  mapOffenderSummaryToCase = (offenderSummary: OffenderSummary) => {
    return {
      name: convertToTitleCase(`${offenderSummary.forename} ${offenderSummary.surname}`.trim()),
      crn: offenderSummary.crn,
      prisonNumber: offenderSummary.prisonNumber,
      probationPractitioner: offenderSummary.probationPractitioner,
      crd: offenderSummary.crd,
      hdced: offenderSummary.hdced,
      workingDaysToHdced: offenderSummary.workingDaysToHdced,
      status: offenderSummary.status as AssessmentStatus,
      currentTask: offenderSummary.currentTask,
      postponementReasons: offenderSummary.postponementReasons,
      postponementDate: offenderSummary.postponementDate,
      lastUpdateBy: offenderSummary.lastUpdateBy,
    }
  }

  public async getAssessmentOverviewSummary(
    token: string,
    agent: Agent,
    prisonNumber: string,
  ): Promise<AssessmentOverviewSummary> {
    return this.assessForEarlyReleaseApiClient.getAssessmentOverviewSummary(token, agent, prisonNumber)
  }
}
