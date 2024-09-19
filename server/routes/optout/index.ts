import { RequestHandler, Router } from 'express'
import { path } from 'static-path'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import roleCheckMiddleware from '../../middleware/roleCheckMiddleware'
import AuthRole from '../../enumeration/authRole'
import OptOutCheckRoutes from './optOutCheck'
import { Services } from '../../services'
import OptOutRoutes from './optOut'

export default function Index({ caseAdminCaseloadService, optOutService }: Services): Router {
  const router = Router()
  const optOutCheckPath = path('/prison/assessment/:prisonNumber/opt-out-check')
  const optOutPath = path('/prison/assessment/:prisonNumber/opt-out')

  const get = (routerPath: string, handler: RequestHandler) =>
    router.get(routerPath, roleCheckMiddleware([AuthRole.SUPPORT]), asyncMiddleware(handler))

  const post = (routerPath: string, handler: RequestHandler) =>
    router.post(routerPath, roleCheckMiddleware([AuthRole.SUPPORT]), asyncMiddleware(handler))

  const optOutCheckHandler = new OptOutCheckRoutes(caseAdminCaseloadService)
  get(optOutCheckPath.pattern, optOutCheckHandler.GET)
  post(optOutCheckPath.pattern, optOutCheckHandler.POST)

  const optOutHandler = new OptOutRoutes(caseAdminCaseloadService, optOutService)
  get(optOutPath.pattern, optOutHandler.GET)
  post(optOutPath.pattern, optOutHandler.POST)

  return router
}
