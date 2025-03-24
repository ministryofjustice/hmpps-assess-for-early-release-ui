import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import type { Agent, OptOutRequest } from '../@types/assessForEarlyReleaseApiClientTypes'
import OptOutReasonType from '../enumeration/optOutReasonType'

export default class OptOutService {
  constructor(private readonly assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient) {}

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
    const optOutRequest: OptOutRequest = {
      reasonType: optOutReasonType,
      otherDescription: otherReason,
      agent,
    }
    return this.assessForEarlyReleaseApiClient.optOut(token, agent, prisonNumber, optOutRequest)
  }
}
