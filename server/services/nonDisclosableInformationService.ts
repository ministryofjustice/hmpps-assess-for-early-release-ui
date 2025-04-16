import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import type { Agent, NonDisclosableInformation } from '../@types/assessForEarlyReleaseApiClientTypes'
import logger from '../../logger'

export default class NonDisclosableInformationService {
  constructor(private readonly assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient) {}

  public async recordNonDisclosableInformation(
    token: string,
    agent: Agent,
    prisonNumber: string,
    nonDisclosableInformation: NonDisclosableInformation,
  ): Promise<void> {
    logger.info('record nondisclosable information called', prisonNumber, nonDisclosableInformation)
    return this.assessForEarlyReleaseApiClient.recordNonDisclosableInformation(
      token,
      agent,
      prisonNumber,
      nonDisclosableInformation,
    )
  }
}
