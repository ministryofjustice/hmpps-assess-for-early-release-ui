import { CommunityOffenderManagerCaseloadService } from '.'
import { Agent } from '../@types/assessForEarlyReleaseApiClientTypes'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createAgent, createAssessmentOverviewSummary, createOffenderSummary } from '../data/__testutils/testObjects'
import { ProbationUser } from '../interfaces/hmppsUser'
import { convertToTitleCase } from '../utils/utils'

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
      assessForEarlyReleaseApiClient.getCommunityOffenderManagerStaffCaseload.mockResolvedValue([aCase])

      const result = await communityOffenderManagerCaseloadService.getCommunityOffenderManagerStaffCaseload(
        token,
        agent,
        user,
      )

      expect(result).toEqual([
        {
          name: convertToTitleCase(`${aCase.forename} ${aCase.surname}`.trim()),
          crn: aCase.crn,
          prisonNumber: aCase.prisonNumber,
          probationPractitioner: aCase.probationPractitioner,
          crd: aCase.crd,
          hdced: aCase.hdced,
          workingDaysToHdced: 3,
          status: aCase.status,
          currentTask: aCase.currentTask,
          postponementDate: null,
          postponementReasons: [],
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
