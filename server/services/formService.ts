import { Agent, DocumentSubjectType } from '../@types/assessForEarlyReleaseApiClientTypes'
import type { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'

export default class FormService {
  constructor(
    private readonly assessForEarlyReleaseApiClientBuilder: RestClientBuilder<AssessForEarlyReleaseApiClient>,
  ) {}

  public async getForm(
    token: string,
    agent: Agent,
    prisonNumber: string,
    documentSubjectType: DocumentSubjectType,
  ): Promise<Buffer> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token, agent)
    return assessForEarlyReleaseApiClient.getForm(prisonNumber, documentSubjectType)
  }
}
