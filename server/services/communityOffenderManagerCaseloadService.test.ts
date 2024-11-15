import { CommunityOffenderManagerCaseloadService } from '.'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createOffenderSummary } from '../data/__testutils/testObjects'
import { ProbationUser } from '../interfaces/hmppsUser'

const AssessForEarlyReleaseApiClientBuilder = jest.fn()
const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'
const user = {
  deliusStaffIdentifier: 1,
} as ProbationUser

describe('COM Caseload Service', () => {
  let communityOffenderManagerCaseloadService: CommunityOffenderManagerCaseloadService

  beforeEach(() => {
    AssessForEarlyReleaseApiClientBuilder.mockReturnValue(assessForEarlyReleaseApiClient)
    communityOffenderManagerCaseloadService = new CommunityOffenderManagerCaseloadService(
      AssessForEarlyReleaseApiClientBuilder,
    )
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Caseload', () => {
    it('get community offender manager caseload', async () => {
      const aCase = createOffenderSummary({})
      assessForEarlyReleaseApiClient.getCommunityOffenderManagerCaseload.mockResolvedValue([aCase])

      const result = await communityOffenderManagerCaseloadService.getCommunityOffenderManagerCaseload(token, user)

      expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
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
})
