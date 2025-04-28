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
  lastUpdateBy?: string
}

export default class CaseAdminCaseloadService {
  constructor(private readonly assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient) {}

  public async getCaseAdminCaseload(token: string, agent: Agent, prisonCode: string): Promise<Case[]> {
    const result = await this.assessForEarlyReleaseApiClient.getCaseAdminCaseload(token, agent, prisonCode)
    return result.map(offenderSummary => ({
      name: convertToTitleCase(`${offenderSummary.forename} ${offenderSummary.surname}`.trim()),
      prisonNumber: offenderSummary.prisonNumber,
      hdced: offenderSummary.hdced,
      crd: offenderSummary.crd,
      workingDaysToHdced: offenderSummary.workingDaysToHdced,
      probationPractitioner: convertToTitleCase(offenderSummary.probationPractitioner?.trim()),
      isPostponed: offenderSummary.isPostponed,
      postponementReasons: offenderSummary.postponementReasons,
      postponementDate: offenderSummary.postponementDate,
      status: offenderSummary.status as AssessmentStatus,
      addressChecksComplete: offenderSummary.addressChecksComplete,
      taskOverdueOn: offenderSummary.taskOverdueOn,
      currentTask: offenderSummary.currentTask,
      lastUpdateBy: offenderSummary.lastUpdateBy,
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
