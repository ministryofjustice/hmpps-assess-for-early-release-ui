import {
  Agent,
  type AssessmentOverviewSummary,
  type AssessmentResponse,
  type AssessmentSearchResponse,
  OffenderResponse,
  type OffenderSearchResponse,
} from '../@types/assessForEarlyReleaseApiClientTypes'
import AferSupportApiClient from '../data/aferSupportApiClient'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'

export default class SupportService {
  constructor(
    private readonly aferSupportApiClient: AferSupportApiClient,
    private readonly assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient,
  ) {}

  public async doOffenderSearch(token: string, agent: Agent, searchString: string): Promise<OffenderSearchResponse[]> {
    return this.aferSupportApiClient.doOffenderSearch(token, agent, searchString)
  }

  public async getOffender(token: string, agent: Agent, prisonNumber: string): Promise<OffenderResponse> {
    return this.aferSupportApiClient.getOffender(token, agent, prisonNumber)
  }

  public async getCurrentAssessment(token: string, agent: Agent, prisonNumber: string): Promise<AssessmentResponse> {
    return this.aferSupportApiClient.getCurrentAssessment(token, agent, prisonNumber)
  }

  public async getAssessments(token: string, agent: Agent, prisonNumber: string): Promise<AssessmentSearchResponse[]> {
    return this.aferSupportApiClient.getAssessments(token, agent, prisonNumber)
  }

  public async getAssessment(token: string, agent: Agent, assessmentId: string): Promise<AssessmentResponse> {
    return this.aferSupportApiClient.getAssessment(token, agent, assessmentId)
  }

  public async getAssessmentOverviewSummary(
    token: string,
    agent: Agent,
    prisonNumber: string,
  ): Promise<AssessmentOverviewSummary> {
    return this.assessForEarlyReleaseApiClient.getAssessmentOverviewSummary(token, agent, prisonNumber)
  }

  public async deleteAssessment(token: string | undefined, agent: Agent, assessmentId: string) {
    return this.aferSupportApiClient.deleteAssessment(token, agent, assessmentId)
  }

  public async deleteCurrentAssessment(token: string | undefined, agent: Agent, prisonNumber: string) {
    return this.aferSupportApiClient.deleteCurrentAssessment(token, agent, prisonNumber)
  }
}
