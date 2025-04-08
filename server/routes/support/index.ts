import { RequestHandler, Router } from 'express'
import { Path } from 'static-path'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import roleCheckMiddleware from '../../middleware/roleCheckMiddleware'
import SupportHomeRoutes from './handlers/supportHome'
import ShowPathRoutes from './handlers/showPaths'

import AuthRole from '../../enumeration/authRole'
import paths from '../paths'
import OffenderSearchHandler from './handlers/offenderSearchHandler'
import OffenderViewHandler from './handlers/offenderViewHandler'
import AssessmentsHandler from './handlers/assessmentsHandler'
import ViewAssessmentHandler from './handlers/viewAssessmentHandler'
import DeleteAssessmentHandler from './handlers/deleteAssessmentHandler'
import { Services } from '../../services'

export default function Index({ supportService }: Services): Router {
  const router = Router()

  const get = <T extends string>(routerPath: Path<T>, handler: RequestHandler) =>
    router.get(routerPath.pattern, roleCheckMiddleware([AuthRole.SUPPORT]), asyncMiddleware(handler))

  const post = <T extends string>(routerPath: Path<T>, handler: RequestHandler) =>
    router.post(routerPath.pattern, roleCheckMiddleware([AuthRole.SUPPORT]), asyncMiddleware(handler))

  const supportHomeHandler = new SupportHomeRoutes()
  get(paths.support.home, supportHomeHandler.GET)

  const showPathsHandler = new ShowPathRoutes()
  get(paths.support.showPaths, showPathsHandler.GET)

  const offenderViewHandler = new OffenderViewHandler(supportService)
  get(paths.support.offender.supportOffenderView, offenderViewHandler.GET)

  const assessmentsHandler = new AssessmentsHandler(supportService)
  get(paths.support.offender.supportAssessments, assessmentsHandler.GET)

  const viewAssessmentHandler = new ViewAssessmentHandler(supportService)
  get(paths.support.offender.supportViewAssessments, viewAssessmentHandler.GET)

  const deleteAssessmentHandler = new DeleteAssessmentHandler(supportService)
  get(paths.support.offender.supportDeleteAssessment, deleteAssessmentHandler.GET)

  const offenderSearchHandler = new OffenderSearchHandler(supportService)
  get(paths.support.offender.supportOffenderSearch, offenderSearchHandler.GET)
  post(paths.support.offender.supportOffenderSearch, offenderSearchHandler.POST)

  const offenderSearchHandlerResults = new OffenderSearchHandler(supportService)
  get(paths.support.offender.supportOffenderSearchView, offenderSearchHandlerResults.GET)
  post(paths.support.offender.supportOffenderSearchView, offenderSearchHandlerResults.POST)

  return router
}
