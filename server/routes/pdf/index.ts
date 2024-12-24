import { RequestHandler, Router } from 'express'
import { Path } from 'static-path'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import roleCheckMiddleware from '../../middleware/roleCheckMiddleware'
import AuthRole from '../../enumeration/authRole'
import paths from '../paths'
import { Services } from '../../services'
import AssessmentPdfRoutes from './assessmentPdf'

export default function Index({ pdfService }: Services): Router {
  const router = Router()

  const get = <T extends string>(routerPath: Path<T>, handler: RequestHandler) =>
    router.get(routerPath.pattern, roleCheckMiddleware([AuthRole.DECISION_MAKER]), asyncMiddleware(handler))

  const assessmentPdfRoutes = new AssessmentPdfRoutes(pdfService)
  get(paths.forms.pdf, assessmentPdfRoutes.GET)

  return router
}
