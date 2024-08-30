import { RequestHandler, Router } from 'express'
import { path } from 'static-path'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import roleCheckMiddleware from '../../middleware/roleCheckMiddleware'
import SupportHomeRoutes from './handlers/supportHome'
import AuthRole from '../../enumeration/authRole'

export default function Index(): Router {
  const router = Router()
  const support = path('/support')

  const get = (routerPath: string, handler: RequestHandler) =>
    router.get(routerPath, roleCheckMiddleware([AuthRole.SUPPORT]), asyncMiddleware(handler))

  const supportHomeHandler = new SupportHomeRoutes()

  get(support({}), supportHomeHandler.GET)

  return router
}
