import type { OffenderSummary } from '../@types/assessForEarlyReleaseApiClientTypes'
import { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'

export default class CaseAdminCaseloadService {
  constructor(
    private readonly assessForEarlyReleaseApiClientBuilder: RestClientBuilder<AssessForEarlyReleaseApiClient>,
  ) {}

  public async getCaseAdminCaseload(token: string, prisonCode: string): Promise<OffenderSummary[]> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.getCaseAdminCaseload(prisonCode)
  }
}