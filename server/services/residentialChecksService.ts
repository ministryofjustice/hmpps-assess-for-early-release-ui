import type {
  Agent,
  ResidentialChecksTaskAnswersSummary,
  ResidentialChecksTaskView,
  ResidentialChecksView,
  SaveResidentialChecksTaskAnswersRequest,
} from '../@types/assessForEarlyReleaseApiClientTypes'
import type { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'

export default class ResidentialChecksService {
  constructor(
    private readonly assessForEarlyReleaseApiClientBuilder: RestClientBuilder<AssessForEarlyReleaseApiClient>,
  ) {}

  public async getResidentialChecksView(
    token: string,
    agent: Agent,
    prisonNumber: string,
    addressCheckRequestId: number,
  ): Promise<ResidentialChecksView> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token, agent)
    return assessForEarlyReleaseApiClient.getResidentialChecksView(prisonNumber, addressCheckRequestId)
  }

  public async getResidentialChecksTask(
    token: string,
    agent: Agent,
    prisonNumber: string,
    addressCheckRequestId: number,
    taskCode: string,
  ): Promise<ResidentialChecksTaskView> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token, agent)
    return assessForEarlyReleaseApiClient.getResidentialChecksTask(prisonNumber, addressCheckRequestId, taskCode)
  }

  public async saveResidentialChecksTaskAnswers(
    token: string,
    agent: Agent,
    prisonNumber: string,
    addressCheckRequestId: number,
    saveAnswersRequest: SaveResidentialChecksTaskAnswersRequest,
  ): Promise<ResidentialChecksTaskAnswersSummary> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token, agent)
    return assessForEarlyReleaseApiClient.saveResidentialChecksTaskAnswers(
      prisonNumber,
      addressCheckRequestId,
      saveAnswersRequest,
    )
  }
}
