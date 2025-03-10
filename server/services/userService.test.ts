import { UserService } from '.'
import { Agent } from '../@types/assessForEarlyReleaseApiClientTypes'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createAgent, createStaffDetails } from '../data/__testutils/testObjects'
import { HmppsUser } from '../interfaces/hmppsUser'

const AssessForEarlyReleaseApiClientBuilder = jest.fn()
const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'
const user = {
  username: 'cvl_com',
} as HmppsUser
const agent = createAgent() as Agent

describe('User Service', () => {
  let userService: UserService

  beforeEach(() => {
    AssessForEarlyReleaseApiClientBuilder.mockReturnValue(assessForEarlyReleaseApiClient)
    userService = new UserService(AssessForEarlyReleaseApiClientBuilder)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Caseload', () => {
    it('get staff details by user name', async () => {
      const staffDetails = createStaffDetails({})
      assessForEarlyReleaseApiClient.getStaffDetailsByUsername.mockResolvedValue(staffDetails)

      const result = await userService.getStaffDetailsByUsername(token, agent, user)

      expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token, agent)
      expect(result).toEqual(staffDetails)
    })
  })
})
