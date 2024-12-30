import { RequestHandler, Router } from 'express'
import { Path } from 'static-path'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import roleCheckMiddleware from '../../middleware/roleCheckMiddleware'
import AuthRole from '../../enumeration/authRole'
import paths from '../paths'
import { Services } from '../../services'
import AssessmentFormRoutes from './assessmentForm'

export default function Index({ formService }: Services): Router {
  const router = Router()

  const get = <T extends string>(routerPath: Path<T>, handler: RequestHandler) =>
    router.get(routerPath.pattern, roleCheckMiddleware([AuthRole.DECISION_MAKER]), asyncMiddleware(handler))

  const assessmentFormRoutes = new AssessmentFormRoutes(formService)
  get(paths.forms.pdf, assessmentFormRoutes.GET)

  return router
}
