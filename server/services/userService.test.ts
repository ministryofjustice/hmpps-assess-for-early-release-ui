import { UserService } from '.'
import { Agent } from '../@types/assessForEarlyReleaseApiClientTypes'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { createAgent, createStaffDetails } from '../data/__testutils/testObjects'
import { HmppsUser } from '../interfaces/hmppsUser'

const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'
const user = {
  username: 'cvl_com',
} as HmppsUser
const agent = createAgent() as Agent

describe('User Service', () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService(assessForEarlyReleaseApiClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Caseload', () => {
    it('get staff details by user name', async () => {
      const staffDetails = createStaffDetails({})
      assessForEarlyReleaseApiClient.getStaffDetailsByUsername.mockResolvedValue(staffDetails)

      const result = await userService.getStaffDetailsByUsername(token, agent, user)

      expect(assessForEarlyReleaseApiClient.getStaffDetailsByUsername).toHaveBeenCalledWith(token, agent, user.username)
      expect(result).toEqual(staffDetails)
    })
  })
})
