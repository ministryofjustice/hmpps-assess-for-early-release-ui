import { RequestHandler, Router } from 'express'
import { path } from 'static-path'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import roleCheckMiddleware from '../../middleware/roleCheckMiddleware'
import AuthRole from '../../enumeration/authRole'
import CaseloadRoutes from './caseload'
import { Services } from '../../services'

export default function Index({ caseAdminCaseloadService }: Services): Router {
  const router = Router()
  const prison = path('/prison')
  const caseload = prison.path('caseload')

  const get = (routerPath: string, handler: RequestHandler) =>
    router.get(routerPath, roleCheckMiddleware([AuthRole.SUPPORT]), asyncMiddleware(handler))

  const supportHomeHandler = new CaseloadRoutes(caseAdminCaseloadService)

  get(caseload({}), supportHomeHandler.GET)

  return router
}
