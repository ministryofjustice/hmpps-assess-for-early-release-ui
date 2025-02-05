import { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import type { Agent, OptOutRequest } from '../@types/assessForEarlyReleaseApiClientTypes'
import OptOutReasonType from '../enumeration/optOutReasonType'

export default class OptOutService {
  constructor(
    private readonly assessForEarlyReleaseApiClientBuilder: RestClientBuilder<AssessForEarlyReleaseApiClient>,
  ) {}

  public async optOut(
    token: string,
    prisonNumber: string,
    {
      optOutReasonType,
      otherReason,
      agent,
    }: {
      optOutReasonType: OptOutReasonType
      otherReason?: string
      agent: Agent
    },
  ): Promise<void> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)

    const optOutRequest: OptOutRequest = {
      reasonType: optOutReasonType,
      otherDescription: otherReason,
      agent,
    }
    return assessForEarlyReleaseApiClient.optOut(prisonNumber, optOutRequest)
  }
}
