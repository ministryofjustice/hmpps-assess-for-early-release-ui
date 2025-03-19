import { Agent, DocumentSubjectType } from '../@types/assessForEarlyReleaseApiClientTypes'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'

export default class FormService {
  constructor(private readonly assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient) {}

  public async getForm(
    token: string,
    agent: Agent,
    prisonNumber: string,
    documentSubjectType: DocumentSubjectType,
  ): Promise<Buffer> {
    return this.assessForEarlyReleaseApiClient.getForm(token, agent, prisonNumber, documentSubjectType)
  }
}
