import { differenceInDays, startOfDay } from 'date-fns'
import type { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import { convertToTitleCase } from '../utils/utils'
import { ProbationUser } from '../interfaces/hmppsUser'

export type Case = {
  name: string
  probationPractitioner: string
  hdced: Date
  remainingDays: number
}

export default class CommunityOffenderManagerCaseloadService {
  constructor(
    private readonly assessForEarlyReleaseApiClientBuilder: RestClientBuilder<AssessForEarlyReleaseApiClient>,
  ) {}

  public async getCommunityOffenderManagerCaseload(token: string, user: ProbationUser): Promise<Case[]> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    const result = await assessForEarlyReleaseApiClient.getCommunityOffenderManagerCaseload(user.deliusStaffIdentifier)
    return result.map(offender => ({
      name: convertToTitleCase(`${offender.forename} ${offender.surname}`.trim()),
      probationPractitioner: offender.prisonNumber,
      hdced: offender.hdced,
      remainingDays: differenceInDays(offender.hdced, startOfDay(new Date())),
    }))
  }
}
