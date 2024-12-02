import type { ResidentialChecksView } from '../@types/assessForEarlyReleaseApiClientTypes'
import type { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'

export default class ResidentialChecksService {
  constructor(
    private readonly assessForEarlyReleaseApiClientBuilder: RestClientBuilder<AssessForEarlyReleaseApiClient>,
  ) {}

  public async getResidentialChecksView(
    token: string,
    prisonNumber: string,
    addressCheckRequestId: number,
  ): Promise<ResidentialChecksView> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.getResidentialChecksView(prisonNumber, addressCheckRequestId)
  }
}
