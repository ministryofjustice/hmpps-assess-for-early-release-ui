import { RequestHandler, Router } from 'express'
import { Path } from 'static-path'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import roleCheckMiddleware from '../../middleware/roleCheckMiddleware'
import AuthRole from '../../enumeration/authRole'
import CaseloadRoutes from './caseload'
import { Services } from '../../services'
import paths from '../paths'
import CheckCurfewAddressesRoutes from './checkCurfewAddresses'

export default function Index({
  addressService,
  caseAdminCaseloadService,
  communityOffenderManagerCaseloadService,
}: Services): Router {
  const router = Router()

  const get = <T extends string>(routerPath: Path<T>, handler: RequestHandler) =>
    router.get(
      routerPath.pattern,
      roleCheckMiddleware([AuthRole.RESPONSIBLE_OFFICER, AuthRole.CASE_ADMIN]),
      asyncMiddleware(handler),
    )

  const caseload = new CaseloadRoutes(communityOffenderManagerCaseloadService)
  get(paths.probation.probationCaseload, caseload.GET)

  const checkCurfewAddressesRoutes = new CheckCurfewAddressesRoutes(addressService, caseAdminCaseloadService)
  get(paths.probation.assessment.curfewAddress.checkCurfewAddresses, checkCurfewAddressesRoutes.GET)

  return router
}
