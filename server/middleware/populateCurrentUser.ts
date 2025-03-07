import { RequestHandler } from 'express'
import { jwtDecode } from 'jwt-decode'
import logger from '../../logger'
import { convertToTitleCase } from '../utils/utils'
import UserService from '../services/userService'

export default function populateCurrentUser(userService: UserService): RequestHandler {
  return async (req, res, next) => {
    try {
      const {
        name,
        user_id: userId,
        authorities: roles = [],
      } = jwtDecode(res.locals.user.token) as {
        name?: string
        user_id?: string
        authorities?: string[]
      }

      res.locals.user = {
        ...res.locals.user,
        userId,
        name,
        displayName: convertToTitleCase(name),
        userRoles: roles.map(role => role.substring(role.indexOf('_') + 1)),
      }

      res.locals.agent = {
        username: res.locals.user.username,
        fullName: convertToTitleCase(name),
        role: 'SUPPORT',
        onBehalfOf: null,
      }

      if (res.locals.user.authSource === 'nomis') {
        const prisonUser = await userService.getPrisonUserDetails(
          req?.middleware?.clientToken,
          res.locals.agent,
          res.locals.user.username,
        )
        res.locals.user.staffId = parseInt(userId, 10) || undefined
        res.locals.activeCaseLoadId = prisonUser?.activeCaseLoadId
        res.locals.agent.onBehalfOf = prisonUser?.activeCaseLoadId
      }

      if (res.locals.user.authSource === 'delius') {
        // Assemble user information from Delius
        const probationUser = await userService.getStaffDetailsByUsername(
          req?.middleware?.clientToken,
          res.locals.agent,
          res.locals.user,
        )
        res.locals.user.deliusStaffCode = probationUser?.code
      }

      next()
    } catch (error) {
      logger.error(error, `Failed to populate user details for: ${res.locals.user?.username}`)
      next(error)
    }
  }
}
