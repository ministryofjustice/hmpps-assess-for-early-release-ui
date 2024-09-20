import { Router } from 'express'

import supportRoutes from './support'
import type { Services } from '../services'
import homeRoutes from './home'
import caseAdminRoutes from './caseAdmin'
import assessRoutes from './optout'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()
  router.use(homeRoutes())
  router.use(supportRoutes())
  router.use(caseAdminRoutes(services))
  router.use(assessRoutes(services))

  return router
}
