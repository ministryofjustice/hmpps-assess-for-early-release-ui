import { differenceInDays, startOfDay } from 'date-fns'
import type { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import { convertToTitleCase } from '../utils/utils'

export type Case = {
  name: string
  prisonNumber: string
  hdced: Date
  remainingDays: number
}

export default class DecisionMakerCaseloadService {
  constructor(
    private readonly assessForEarlyReleaseApiClientBuilder: RestClientBuilder<AssessForEarlyReleaseApiClient>,
  ) {}

  public async getDecisionMakerCaseload(token: string, prisonCode: string): Promise<Case[]> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    const result = await assessForEarlyReleaseApiClient.getDecisionMakerCaseload(prisonCode)
    return result.map(offender => ({
      name: convertToTitleCase(`${offender.forename} ${offender.surname}`.trim()),
      prisonNumber: offender.prisonNumber,
      hdced: offender.hdced,
      remainingDays: differenceInDays(offender.hdced, startOfDay(new Date())),
    }))
  }
}
