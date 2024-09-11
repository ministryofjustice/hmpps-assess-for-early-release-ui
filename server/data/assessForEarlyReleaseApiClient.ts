import type { AssessmentSummary, OffenderSummary } from '../@types/assessForEarlyReleaseApiClientTypes'
import config, { ApiConfig } from '../config'
import RestClient from './restClient'

export default class AssessForEarlyReleaseApiClient {
  private restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient(
      'assessForEarlyReleaseApi',
      config.apis.assessForEarlyReleaseApi as ApiConfig,
      token,
    )
  }

  async getCaseAdminCaseload(prisonCode: string): Promise<OffenderSummary[]> {
    return this.restClient.get<OffenderSummary[]>({ path: `/prison/${prisonCode}/case-admin/caseload` })
  }

  async getAssessmentSummary(prisonNumber: string): Promise<AssessmentSummary> {
    return this.restClient.get<AssessmentSummary>({ path: `/offender/${prisonNumber}/current-assessment` })
  }
}
