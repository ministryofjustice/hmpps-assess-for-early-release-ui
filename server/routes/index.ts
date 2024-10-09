import { Router } from 'express'

import supportRoutes from './support'
import type { Services } from '../services'
import homeRoutes from './home'
import caseAdminRoutes from './caseAdmin'
import optOutRoutes from './optout'
import curfewAddressRoutes from './curfewAddress'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function routes(services: Services): Router {
  const router = Router()
  router.use(homeRoutes())
  router.use(supportRoutes())
  router.use(caseAdminRoutes(services))
  router.use(optOutRoutes(services))
  router.use(curfewAddressRoutes(services))

  return router
}
