import { RequestHandler, Router } from 'express'
import { path } from 'static-path'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import roleCheckMiddleware from '../../middleware/roleCheckMiddleware'
import AuthRole from '../../enumeration/authRole'
import CaseloadRoutes from './handlers/caseload'

export default function Index(): Router {
  const router = Router()
  const prison = path('/prison')
  const caseload = prison.path('caseload')
  const assess = caseload.path('assess')

  const get = (routerPath: string, handler: RequestHandler) =>
    router.get(routerPath, roleCheckMiddleware([AuthRole.SUPPORT]), asyncMiddleware(handler))

  const supportHomeHandler = new CaseloadRoutes()

  get(assess({}), supportHomeHandler.GET)

  return router
}
