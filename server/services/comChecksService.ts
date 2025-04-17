import { Agent, UpdateVloAndPomConsultationRequest } from '../@types/assessForEarlyReleaseApiClientTypes'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'

export default class ComChecksService {
  constructor(private readonly assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient) {}

  updateVloAndPomConsultation(
    token: string,
    agent: Agent,
    prisonNumber: string,
    victimContactSchemeOptedIn: boolean,
    victimContactSchemeRequests?: string,
    pomBehaviourInformation?: string,
  ) {
    const updateVloAndPomConsultationRequest: UpdateVloAndPomConsultationRequest = {
      victimContactSchemeOptedIn,
      victimContactSchemeRequests,
      pomBehaviourInformation,
    }

    return this.assessForEarlyReleaseApiClient.updateVloAndPomConsultation(
      token,
      agent,
      prisonNumber,
      updateVloAndPomConsultationRequest,
    )
  }
}
