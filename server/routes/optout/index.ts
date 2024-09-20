import { RequestHandler, Router } from 'express'
import { Path } from 'static-path'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import roleCheckMiddleware from '../../middleware/roleCheckMiddleware'
import AuthRole from '../../enumeration/authRole'
import OptOutCheckRoutes from './optOutCheck'
import { Services } from '../../services'
import OptOutRoutes from './optOut'
import paths from '../paths'

export default function Index({ caseAdminCaseloadService, optOutService }: Services): Router {
  const router = Router()

  const get = <T extends string>(routerPath: Path<T>, handler: RequestHandler) =>
    router.get(routerPath.pattern, roleCheckMiddleware([AuthRole.CASE_ADMIN]), asyncMiddleware(handler))

  const post = <T extends string>(routerPath: Path<T>, handler: RequestHandler) =>
    router.post(routerPath.pattern, roleCheckMiddleware([AuthRole.SUPPORT]), asyncMiddleware(handler))

  const optOutCheckHandler = new OptOutCheckRoutes(caseAdminCaseloadService)
  get(paths.prison.assessment.optOutCheckPath, optOutCheckHandler.GET)
  post(paths.prison.assessment.optOutCheckPath, optOutCheckHandler.POST)

  const optOutHandler = new OptOutRoutes(caseAdminCaseloadService, optOutService)
  get(paths.prison.assessment.optOutPath, optOutHandler.GET)
  post(paths.prison.assessment.optOutPath, optOutHandler.POST)

  return router
}
