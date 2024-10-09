import { RequestHandler, Router } from 'express'
import { Path } from 'static-path'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import roleCheckMiddleware from '../../middleware/roleCheckMiddleware'
import AuthRole from '../../enumeration/authRole'
import FindAddressRoutes from './findAddress'
import paths from '../paths'
import { Services } from '../../services'
import SelectAddressRoutes from './selectAddress'
import NoAddressFoundRoutes from './noAddressFound'

export default function Index({ addressService, caseAdminCaseloadService }: Services): Router {
  const router = Router()

  const get = <T extends string>(routerPath: Path<T>, handler: RequestHandler) =>
    router.get(routerPath.pattern, roleCheckMiddleware([AuthRole.CASE_ADMIN]), asyncMiddleware(handler))

  const post = <T extends string>(routerPath: Path<T>, handler: RequestHandler) =>
    router.post(routerPath.pattern, roleCheckMiddleware([AuthRole.CASE_ADMIN]), asyncMiddleware(handler))

  const findAddressHandler = new FindAddressRoutes(addressService, caseAdminCaseloadService)
  get(paths.prison.assessment.curfewAddress.findAddress, findAddressHandler.GET)
  post(paths.prison.assessment.curfewAddress.findAddress, findAddressHandler.POST)

  const selectAddressHandler = new SelectAddressRoutes(addressService, caseAdminCaseloadService)
  get(paths.prison.assessment.curfewAddress.selectAddress, selectAddressHandler.GET)
  post(paths.prison.assessment.curfewAddress.selectAddress, selectAddressHandler.POST)

  const noAddressFoundHandler = new NoAddressFoundRoutes(caseAdminCaseloadService)
  get(paths.prison.assessment.curfewAddress.noAddressFound, noAddressFoundHandler.GET)

  return router
}
