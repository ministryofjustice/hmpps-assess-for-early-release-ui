import AssessApiClient from '../data/assessApiClient'

export default class AssessCaseloadService {
  constructor(private readonly assessApiClient: AssessApiClient) {}

  async getAssessCaseload(user: Express.User) {
    return this.assessApiClient.assessOffender(user)
  }
}
