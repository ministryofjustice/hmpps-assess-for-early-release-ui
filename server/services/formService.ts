import type { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'

export default class FormService {
  constructor(
    private readonly assessForEarlyReleaseApiClientBuilder: RestClientBuilder<AssessForEarlyReleaseApiClient>,
  ) {}

  public async getForm(token: string, { title, message }: { title: string; message: string }): Promise<Buffer> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.getForm({ title, message })
  }
}
