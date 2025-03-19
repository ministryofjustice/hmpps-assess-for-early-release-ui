import type { Agent, AssessmentOverviewSummary } from '../@types/assessForEarlyReleaseApiClientTypes'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import { convertToTitleCase } from '../utils/utils'
import AssessmentStatus from '../enumeration/assessmentStatus'

export type Case = {
  name: string
  prisonNumber: string
  hdced: Date
  workingDaysToHdced: number
  probationPractitioner: string
  isPostponed: boolean
  postponementReason?: string
  postponementDate?: Date
  status: AssessmentStatus
  addressChecksComplete: boolean
  taskOverdueOn?: Date
  currentTask?: string
}

export default class CaseAdminCaseloadService {
  constructor(private readonly assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient) {}

  public async getCaseAdminCaseload(token: string, agent: Agent, prisonCode: string): Promise<Case[]> {
    const result = await this.assessForEarlyReleaseApiClient.getCaseAdminCaseload(token, agent, prisonCode)
    return result.map(offender => ({
      name: convertToTitleCase(`${offender.forename} ${offender.surname}`.trim()),
      prisonNumber: offender.prisonNumber,
      hdced: offender.hdced,
      workingDaysToHdced: offender.workingDaysToHdced,
      probationPractitioner: convertToTitleCase(offender.probationPractitioner?.trim()),
      isPostponed: offender.isPostponed,
      postponementReasons: offender.postponementReasons,
      postponementDate: offender.postponementDate,
      status: offender.status as AssessmentStatus,
      addressChecksComplete: offender.addressChecksComplete,
      taskOverdueOn: offender.taskOverdueOn,
      currentTask: offender.currentTask,
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
