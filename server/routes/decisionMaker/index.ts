import { RequestHandler, Router } from 'express'
import { Path } from 'static-path'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import roleCheckMiddleware from '../../middleware/roleCheckMiddleware'
import AuthRole from '../../enumeration/authRole'
import paths from '../paths'
import { Services } from '../../services'
import CaseloadRoutes from './caseload'

export default function Index({ decisionMakerCaseloadService }: Services): Router {
  const router = Router()

  const get = <T extends string>(routerPath: Path<T>, handler: RequestHandler) =>
    router.get(routerPath.pattern, roleCheckMiddleware([AuthRole.DECISION_MAKER]), asyncMiddleware(handler))

  const caseload = new CaseloadRoutes(decisionMakerCaseloadService)
  get(paths.decisionMaker.decisionMakerCaseload, caseload.GET)

  return router
}
