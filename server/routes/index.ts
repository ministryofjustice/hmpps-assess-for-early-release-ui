import { Router } from 'express'

import supportRoutes from './support'
import type { Services } from '../services'
import homeRoutes from './home'
import assessingLicencesRoute from './caseAdmin'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()
  router.use(homeRoutes())
  router.use(supportRoutes())
  router.use(assessingLicencesRoute(services))

  return router
}
