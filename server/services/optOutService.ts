import { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import type { OptOutRequest } from '../@types/assessForEarlyReleaseApiClientTypes'
import OptOutReasonType from '../enumeration/optOutReasonType'

export default class OptOutService {
  constructor(
    private readonly assessForEarlyReleaseApiClientBuilder: RestClientBuilder<AssessForEarlyReleaseApiClient>,
  ) {}

  public async optOut(
    token: string,
    prisonNumber: string,
    optOutReasonType: OptOutReasonType,
    otherReason?: string,
  ): Promise<void> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)

    const optOutRequest: OptOutRequest = {
      reasonType: optOutReasonType,
      otherDescription: otherReason,
    }
    return assessForEarlyReleaseApiClient.optOut(prisonNumber, optOutRequest)
  }
}
