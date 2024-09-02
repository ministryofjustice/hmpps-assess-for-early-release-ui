import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'

export default class CaseAdminCaseloadService {
  constructor(private readonly assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient) {}

  async getCaseAdminCaseload() {
    return this.assessForEarlyReleaseApiClient.getCaseAdminCaseload()
  }
}
