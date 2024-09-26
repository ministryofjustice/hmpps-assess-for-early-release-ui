import { RequestHandler, Router } from 'express'
import { Path } from 'static-path'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import roleCheckMiddleware from '../../middleware/roleCheckMiddleware'
import SupportHomeRoutes from './handlers/supportHome'
import ShowPathRoutes from './handlers/showPaths'

import AuthRole from '../../enumeration/authRole'
import paths from '../paths'

export default function Index(): Router {
  const router = Router()

  const get = <T extends string>(routerPath: Path<T>, handler: RequestHandler) =>
    router.get(routerPath.pattern, roleCheckMiddleware([AuthRole.SUPPORT]), asyncMiddleware(handler))

  const supportHomeHandler = new SupportHomeRoutes()

  get(paths.support.home, supportHomeHandler.GET)

  const showPathsHandler = new ShowPathRoutes()
  get(paths.support.showPaths, showPathsHandler.GET)

  return router
}
