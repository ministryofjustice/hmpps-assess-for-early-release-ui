import { format } from 'date-fns'
import type {
  AssessmentSummary,
  InitialChecks,
  OffenderSummary,
  OptOutRequest,
} from '../@types/assessForEarlyReleaseApiClientTypes'
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
    const caseAdminCaseload = await this.restClient.get<OffenderSummary[]>({
      path: `/prison/${prisonCode}/case-admin/caseload`,
    })
    return caseAdminCaseload.map(c => {
      return { ...c, hdced: format(c.hdced, 'dd MMM yyyy') }
    })
  }

  async getAssessmentSummary(prisonNumber: string): Promise<AssessmentSummary> {
    const assessmentSummary = await this.restClient.get<AssessmentSummary>({
      path: `/offender/${prisonNumber}/current-assessment`,
    })
    return {
      ...assessmentSummary,
      hdced: format(assessmentSummary.hdced, 'dd MMM yyyy'),
      crd: assessmentSummary.crd ? format(assessmentSummary.crd, 'dd MMM yyyy') : 'not found',
    }
  }

  async getInitialCheckStatus(prisonNumber: string): Promise<InitialChecks> {
    return this.restClient.get<InitialChecks>({
      path: `/offender/${prisonNumber}/current-assessment/initial-checks`,
    })
  }

  async optOut(prisonNumber: string, optOutRequest: OptOutRequest): Promise<void> {
    return this.restClient.put({ path: `/offender/${prisonNumber}/current-assessment/opt-out`, data: optOutRequest })
  }
}
