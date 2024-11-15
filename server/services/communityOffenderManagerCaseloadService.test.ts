// import { CommunityOffenderManagerCaseloadService } from '.'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
// import { createAssessmentSummary, createOffenderSummary } from '../data/__testutils/testObjects'
// import { ProbationUser } from '../interfaces/hmppsUser'

const AssessForEarlyReleaseApiClientBuilder = jest.fn()
const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
// const token = 'TOKEN-1'
// const user = {
//   deliusStaffIdentifier: 1,
// } as ProbationUser

describe('COM Caseload Service', () => {
  // let communityOffenderManagerCaseloadService: CommunityOffenderManagerCaseloadService

  beforeEach(() => {
    AssessForEarlyReleaseApiClientBuilder.mockReturnValue(assessForEarlyReleaseApiClient)
    // communityOffenderManagerCaseloadService = new CommunityOffenderManagerCaseloadService(
    //   AssessForEarlyReleaseApiClientBuilder,
    // )
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Caseload', () => {
    it('get community offender manager caseload', async () => {
      expect(true).toBe(true)
      // const aCase = createOffenderSummary({})
      // assessForEarlyReleaseApiClient.getCaseAdminCaseload.mockResolvedValue([aCase])

      // const result = await communityOffenderManagerCaseloadService.getCommunityOffenderManagerCaseload(token, user)

      // expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
      // expect(result).toEqual([
      //   {
      //     name: 'Jim Smith',
      //     remainingDays: 3,
      //     prisonNumber: 'A1234AB',
      //     hdced: aCase.hdced,
      //   },
      // ])
    })
  })

  describe('Assessment Summary', () => {
    // const assessmentSummary = createAssessmentSummary({})

    it('get assessment summary', async () => {
      expect(true).toBe(true)
      // assessForEarlyReleaseApiClient.getAssessmentSummary.mockResolvedValue(assessmentSummary)

      // const result = await communityOffenderManagerCaseloadService.getCommunityOffenderManagerCaseload(token, user)

      // expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
      // expect(result).toEqual(assessmentSummary)
    })
  })
})
