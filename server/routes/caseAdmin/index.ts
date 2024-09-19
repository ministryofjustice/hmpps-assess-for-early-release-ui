import { RequestHandler, Router } from 'express'
import { Path } from 'static-path'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import roleCheckMiddleware from '../../middleware/roleCheckMiddleware'
import AuthRole from '../../enumeration/authRole'
import CaseloadRoutes from './caseload'
import { Services } from '../../services'
import AssessmentRoutes from './assessment'
import TasklistRoutes from './initialChecks/tasklist'
import paths from '../paths'

export default function Index({ caseAdminCaseloadService }: Services): Router {
  const router = Router()

  const get = <T extends string>(routerPath: Path<T>, handler: RequestHandler) =>
    router.get(routerPath.pattern, roleCheckMiddleware([AuthRole.CASE_ADMIN]), asyncMiddleware(handler))

  const supportHomeHandler = new CaseloadRoutes(caseAdminCaseloadService)
  get(paths.prison.caseload, supportHomeHandler.GET)

  const assessmentHandler = new AssessmentRoutes(caseAdminCaseloadService)
  get(paths.prison.assessment.home, assessmentHandler.GET)

  const tasklistRoutes = new TasklistRoutes(caseAdminCaseloadService)
  get(paths.prison.assessment.initialChecks, tasklistRoutes.GET)

  return router
}
