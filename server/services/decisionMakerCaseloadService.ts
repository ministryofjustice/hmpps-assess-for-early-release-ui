import DecisionMakerApiClient from '../data/decisionMakerApiClient'

export default class DecisionMakerCaseloadService {
  constructor(private readonly decisionMakerApiClient: DecisionMakerApiClient) {}

  async getDecisionMakerCaseload() {
    return this.decisionMakerApiClient.assessOffender()
  }
}
