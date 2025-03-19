import { Agent, DeliusStaff, PrisonUserDetails } from '../@types/assessForEarlyReleaseApiClientTypes'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import { HmppsUser } from '../interfaces/hmppsUser'

export default class UserService {
  constructor(private readonly assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient) {}

  async getStaffDetailsByUsername(token: string, agent: Agent, user: HmppsUser): Promise<DeliusStaff> {
    return this.assessForEarlyReleaseApiClient.getStaffDetailsByUsername(token, agent, user.username)
  }

  async getPrisonUserDetails(token: string, agent: Agent, username: string): Promise<PrisonUserDetails> {
    return this.assessForEarlyReleaseApiClient.getPrisonUserDetails(token, agent, username)
  }
}
