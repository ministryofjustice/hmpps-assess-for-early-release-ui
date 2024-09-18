import { RequestHandler, Router } from 'express'
import { path } from 'static-path'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import roleCheckMiddleware from '../../middleware/roleCheckMiddleware'
import AuthRole from '../../enumeration/authRole'
import CaseloadRoutes from './caseload'
import { Services } from '../../services'
import AssessmentRoutes from './assessment'
import TasklistRoutes from './initialChecks/tasklist'

export default function Index({ caseAdminCaseloadService }: Services): Router {
  const router = Router()
  const prison = path('/prison')
  const caseload = prison.path('caseload')
  const assessment = prison.path('assessment/:prisonNumber')
  const initialChecks = assessment.path('initial-checks')

  const get = (routerPath: string, handler: RequestHandler) =>
    router.get(routerPath, roleCheckMiddleware([AuthRole.CASE_ADMIN]), asyncMiddleware(handler))

  const supportHomeHandler = new CaseloadRoutes(caseAdminCaseloadService)

  get(caseload.pattern, supportHomeHandler.GET)

  const assessmentHandler = new AssessmentRoutes(caseAdminCaseloadService)

  get(assessment.pattern, assessmentHandler.GET)

  const tasklistRoutes = new TasklistRoutes(caseAdminCaseloadService)
  get(initialChecks.pattern, tasklistRoutes.GET)

  return router
}
