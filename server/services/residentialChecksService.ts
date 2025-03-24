import type {
  Agent,
  ResidentialChecksTaskAnswersSummary,
  ResidentialChecksTaskView,
  ResidentialChecksView,
  SaveResidentialChecksTaskAnswersRequest,
} from '../@types/assessForEarlyReleaseApiClientTypes'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'

export default class ResidentialChecksService {
  constructor(private readonly assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient) {}

  public async getResidentialChecksView(
    token: string,
    agent: Agent,
    prisonNumber: string,
    addressCheckRequestId: number,
  ): Promise<ResidentialChecksView> {
    return this.assessForEarlyReleaseApiClient.getResidentialChecksView(
      token,
      agent,
      prisonNumber,
      addressCheckRequestId,
    )
  }

  public async getResidentialChecksTask(
    token: string,
    agent: Agent,
    prisonNumber: string,
    addressCheckRequestId: number,
    taskCode: string,
  ): Promise<ResidentialChecksTaskView> {
    return this.assessForEarlyReleaseApiClient.getResidentialChecksTask(
      token,
      agent,
      prisonNumber,
      addressCheckRequestId,
      taskCode,
    )
  }

  public async saveResidentialChecksTaskAnswers(
    token: string,
    agent: Agent,
    prisonNumber: string,
    addressCheckRequestId: number,
    saveAnswersRequest: SaveResidentialChecksTaskAnswersRequest,
  ): Promise<ResidentialChecksTaskAnswersSummary> {
    return this.assessForEarlyReleaseApiClient.saveResidentialChecksTaskAnswers(
      token,
      agent,
      prisonNumber,
      addressCheckRequestId,
      saveAnswersRequest,
    )
  }
}
