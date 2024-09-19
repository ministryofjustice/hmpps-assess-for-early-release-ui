import type {
  _AssessmentSummary,
  AssessmentSummary,
  _InitialChecks,
  InitialChecks,
  _OffenderSummary,
  OffenderSummary,
} from '../@types/assessForEarlyReleaseApiClientTypes'
import config, { ApiConfig } from '../config'
import RestClient from './restClient'
import { parseIsoDate } from '../utils/utils'

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
    const caseAdminCaseload = await this.restClient.get<_OffenderSummary[]>({
      path: `/prison/${prisonCode}/case-admin/caseload`,
    })
    return caseAdminCaseload.map(c => {
      return { ...c, hdced: parseIsoDate(c.hdced) }
    })
  }

  async getAssessmentSummary(prisonNumber: string): Promise<AssessmentSummary> {
    const assessmentSummary = await this.restClient.get<_AssessmentSummary>({
      path: `/offender/${prisonNumber}/current-assessment`,
    })
    return {
      ...assessmentSummary,
      hdced: parseIsoDate(assessmentSummary.hdced),
      crd: parseIsoDate(assessmentSummary.crd),
    }
  }

  async getInitialCheckStatus(prisonNumber: string): Promise<InitialChecks> {
    const initialChecks = await this.restClient.get<_InitialChecks>({
      path: `/offender/${prisonNumber}/current-assessment/initial-checks`,
    })
    return {
      ...initialChecks,
      assessmentSummary: {
        ...initialChecks.assessmentSummary,
        hdced: parseIsoDate(initialChecks.assessmentSummary.hdced),
        crd: parseIsoDate(initialChecks.assessmentSummary.crd),
      },
    }
  }
}
