import { CommunityOffenderManagerCaseloadService } from '.'
import { Agent } from '../@types/assessForEarlyReleaseApiClientTypes'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createAgent, createAssessmentOverviewSummary, createOffenderSummary } from '../data/__testutils/testObjects'
import { ProbationUser } from '../interfaces/hmppsUser'

const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'
const user = {
  deliusStaffCode: 'STAFF1',
} as ProbationUser
const agent = createAgent() as Agent

describe('COM Caseload Service', () => {
  let communityOffenderManagerCaseloadService: CommunityOffenderManagerCaseloadService

  beforeEach(() => {
    communityOffenderManagerCaseloadService = new CommunityOffenderManagerCaseloadService(
      assessForEarlyReleaseApiClient,
    )
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Caseload', () => {
    it('get community offender manager caseload', async () => {
      const aCase = createOffenderSummary({})
      assessForEarlyReleaseApiClient.getCommunityOffenderManagerCaseload.mockResolvedValue([aCase])

      const result = await communityOffenderManagerCaseloadService.getCommunityOffenderManagerCaseload(
        token,
        agent,
        user,
      )

      expect(result).toEqual([
        {
          name: 'Jim Smith',
          prisonNumber: 'A1234AB',
          probationPractitioner: 'CVl_COM',
          hdced: aCase.hdced,
          workingDaysToHdced: 3,
        },
      ])
    })
  })
  describe('Assessment Summary', () => {
    const assessmentOverviewSummary = createAssessmentOverviewSummary({})

    it('get assessment summary', async () => {
      assessForEarlyReleaseApiClient.getAssessmentOverviewSummary.mockResolvedValue(assessmentOverviewSummary)

      const result = await communityOffenderManagerCaseloadService.getAssessmentOverviewSummary(
        token,
        agent,
        assessmentOverviewSummary.prisonNumber,
      )

      expect(result).toEqual(assessmentOverviewSummary)
    })
  })
})
