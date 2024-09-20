import { differenceInDays, startOfDay } from 'date-fns'
import type { AssessmentSummary, InitialChecks } from '../@types/assessForEarlyReleaseApiClientTypes'
import { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import { convertToTitleCase } from '../utils/utils'

export type Case = {
  name: string
  prisonNumber: string
  hdced: Date
  remainingDays: number
}

export default class CaseAdminCaseloadService {
  constructor(
    private readonly assessForEarlyReleaseApiClientBuilder: RestClientBuilder<AssessForEarlyReleaseApiClient>,
  ) {}

  public async getCaseAdminCaseload(token: string, prisonCode: string): Promise<Case[]> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    const result = await assessForEarlyReleaseApiClient.getCaseAdminCaseload(prisonCode)
    return result.map(offender => ({
      name: convertToTitleCase(`${offender.forename} ${offender.surname}`.trim()),
      prisonNumber: offender.prisonNumber,
      hdced: offender.hdced,
      remainingDays: differenceInDays(offender.hdced, startOfDay(new Date())),
    }))
  }

  public async getAssessmentSummary(token: string, prisonNumber: string): Promise<AssessmentSummary> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.getAssessmentSummary(prisonNumber)
  }

  public async getInitialChecks(token: string, prisonNumber: string): Promise<InitialChecks> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.getInitialCheckStatus(prisonNumber)
  }
}
