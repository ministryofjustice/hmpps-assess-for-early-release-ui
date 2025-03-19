import { Router } from 'express'
import type { VerificationClient } from '@ministryofjustice/hmpps-auth-clients'
import auth from '../authentication/auth'
import populateCurrentUser from './populateCurrentUser'
import UserService from '../services/userService'

export default function setUpCurrentUser(userService: UserService, verificationClient: VerificationClient): Router {
  const router = Router({ mergeParams: true })
  router.use(auth.authenticationMiddleware(verificationClient))
  router.use(populateCurrentUser(userService))
  return router
}
