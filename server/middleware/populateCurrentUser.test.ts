import jwt from 'jsonwebtoken'
import populateCurrentUser from './populateCurrentUser'
import { mockRequest, mockResponse } from '../routes/__testutils/requestTestUtils'
import { createMockUserService } from '../services/__testutils/mock'
import { createStaffDetails } from '../data/__testutils/testObjects'

jest.mock('../services/userService')

const next = jest.fn()
function createToken(authSource: string, authorities: string[]) {
  const payload = {
    user_name: 'USER1',
    scope: ['read', 'write'],
    auth_source: authSource,
    authorities,
    jti: 'a610a10-cca6-41db-985f-e87efb303aaf',
    user_id: 10,
    client_id: 'clientid',
  }

  return jwt.sign(payload, 'secret', { expiresIn: '1h' })
}

const userService = createMockUserService()

const middleware = populateCurrentUser(userService)
const req = mockRequest({ middleware: {} })
const res = mockResponse({
  locals: {
    user: {
      username: 'USER1',
    },
  },
})
const staffDetails = createStaffDetails({})

beforeEach(() => {
  jest.resetAllMocks()
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('populateCurrentUser', () => {
  it('should populate nomis user details', async () => {
    res.locals.user.token = createToken('nomis', [])
    res.locals.user.authSource = 'nomis'

    await middleware(req, res, next)

    expect(res.locals.user).toEqual(
      expect.objectContaining({
        staffId: 10,
      }),
    )
    expect(next).toHaveBeenCalled()
  })

  it('should populate delius user details', async () => {
    res.locals.user.token = createToken('delius', [])
    res.locals.user.authSource = 'delius'

    userService.getStaffDetailsByUsername.mockResolvedValue(staffDetails)

    await middleware(req, res, next)

    expect(res.locals.user).toEqual(
      expect.objectContaining({
        deliusStaffCode: 'ABC',
      }),
    )
    expect(userService.getStaffDetailsByUsername).toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })
})
