import { RequestHandler, Router } from 'express'
import { Path } from 'static-path'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import roleCheckMiddleware from '../../middleware/roleCheckMiddleware'
import AuthRole from '../../enumeration/authRole'
import CaseloadRoutes from './caseload'
import { Services } from '../../services'
import paths from '../paths'

export default function Index({ communityOffenderManagerCaseloadService }: Services): Router {
  const router = Router()

  const get = <T extends string>(routerPath: Path<T>, handler: RequestHandler) =>
    router.get(routerPath.pattern, roleCheckMiddleware([AuthRole.RESPONSIBLE_OFFICER]), asyncMiddleware(handler))

  const caseload = new CaseloadRoutes(communityOffenderManagerCaseloadService)
  get(paths.probation.probationCaseload, caseload.GET)

  return router
}
