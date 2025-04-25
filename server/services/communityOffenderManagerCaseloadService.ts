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

  mapOffenderSummaryToCase = (offender: OffenderSummary) => {
    return {
      name: convertToTitleCase(`${offender.forename} ${offender.surname}`.trim()),
      crn: offender.crn,
      prisonNumber: offender.prisonNumber,
      probationPractitioner: offender.probationPractitioner,
      crd: offender.crd,
      hdced: offender.hdced,
      workingDaysToHdced: offender.workingDaysToHdced,
      status: offender.status as AssessmentStatus,
      currentTask: offender.currentTask,
      postponementReasons: offender.postponementReasons,
      postponementDate: offender.postponementDate,
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
