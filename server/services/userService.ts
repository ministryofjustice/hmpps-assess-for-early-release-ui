import { DeliusStaff } from '../@types/assessForEarlyReleaseApiClientTypes'
import { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import { HmppsUser } from '../interfaces/hmppsUser'

export default class UserService {
  constructor(
    private readonly assessForEarlyReleaseApiClientBuilder: RestClientBuilder<AssessForEarlyReleaseApiClient>,
  ) {}

  async getStaffDetailsByUsername(token: string, user: HmppsUser): Promise<DeliusStaff> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.getStaffDetailsByUsername(user.username)
  }
}
