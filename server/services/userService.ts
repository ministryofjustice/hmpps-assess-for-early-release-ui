import { Agent, DeliusStaff, PrisonUserDetails } from '../@types/assessForEarlyReleaseApiClientTypes'
import { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import { HmppsUser } from '../interfaces/hmppsUser'

export default class UserService {
  constructor(
    private readonly assessForEarlyReleaseApiClientBuilder: RestClientBuilder<AssessForEarlyReleaseApiClient>,
  ) {}

  async getStaffDetailsByUsername(token: string, agent: Agent, user: HmppsUser): Promise<DeliusStaff> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token, agent)
    return assessForEarlyReleaseApiClient.getStaffDetailsByUsername(user.username)
  }

  async getPrisonUserDetails(token: string, agent: Agent, username: string): Promise<PrisonUserDetails> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token, agent)
    return assessForEarlyReleaseApiClient.getPrisonUserDetails(username)
  }
}
