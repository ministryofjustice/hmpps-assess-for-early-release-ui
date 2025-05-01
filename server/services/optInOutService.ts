import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import type { Agent, OptOutRequest } from '../@types/assessForEarlyReleaseApiClientTypes'
import OptOutReasonType from '../enumeration/optOutReasonType'

export default class OptInOutService {
  constructor(private readonly assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient) {}

  public async optIn(token: string, prisonNumber: string, agent: Agent): Promise<void> {
    return this.assessForEarlyReleaseApiClient.optIn(token, agent, prisonNumber)
  }

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
