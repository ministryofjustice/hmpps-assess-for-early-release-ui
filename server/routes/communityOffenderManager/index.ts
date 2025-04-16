import { RequestHandler, Router } from 'express'
import { Path } from 'static-path'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import roleCheckMiddleware from '../../middleware/roleCheckMiddleware'
import AuthRole from '../../enumeration/authRole'
import CaseloadRoutes from './caseload'
import { Services } from '../../services'
import paths from '../paths'
import CheckCurfewAddressesRoutes from './checkCurfewAddresses'
import AssessmentRoutes from './assessment'
import ResidentialChecksTasklistRoutes from './residentialChecks/tasklist'
import ResidentialChecksTaskRoutes from './residentialChecks/task'
import ReviewInformationRoutes from './reviewInformation'
import setAgentRoleMiddleware from '../../middleware/setAgentRoleMiddleware'
import NonDisclosableInformationRoutes from './nonDisclosableInformation'

export default function Index({
  addressService,
  caseAdminCaseloadService,
  communityOffenderManagerCaseloadService,
  residentialChecksService,
  nonDisclosableInformationService,
}: Services): Router {
  const router = Router()

  const get = <T extends string>(routerPath: Path<T>, handler: RequestHandler) =>
    router.get(
      routerPath.pattern,
      roleCheckMiddleware([AuthRole.RESPONSIBLE_OFFICER, AuthRole.CASE_ADMIN]),
      asyncMiddleware(handler),
    )

  const post = <T extends string>(routerPath: Path<T>, handler: RequestHandler) =>
    router.post(
      routerPath.pattern,
      setAgentRoleMiddleware('PROBATION_COM'),
      roleCheckMiddleware([AuthRole.RESPONSIBLE_OFFICER, AuthRole.CASE_ADMIN]),
      asyncMiddleware(handler),
    )

  const caseload = new CaseloadRoutes(communityOffenderManagerCaseloadService)
  get(paths.probation.probationCaseload, caseload.GET)

  const assessmentHandler = new AssessmentRoutes(communityOffenderManagerCaseloadService)
  get(paths.probation.assessment.home, assessmentHandler.GET)

  const checkCurfewAddressesRoutes = new CheckCurfewAddressesRoutes(addressService, caseAdminCaseloadService)
  get(paths.probation.assessment.curfewAddress.checkCurfewAddresses, checkCurfewAddressesRoutes.GET)

  const residentialChecksTaskListRoutes = new ResidentialChecksTasklistRoutes(addressService, residentialChecksService)
  get(paths.probation.assessment.curfewAddress.addressCheckTasklist, residentialChecksTaskListRoutes.GET)

  const residentialChecksTaskRoutes = new ResidentialChecksTaskRoutes(addressService, residentialChecksService)
  get(paths.probation.assessment.curfewAddress.addressCheckTask, residentialChecksTaskRoutes.GET)
  post(paths.probation.assessment.curfewAddress.addressCheckTask, residentialChecksTaskRoutes.POST)

  const reviewInformationRoutes = new ReviewInformationRoutes(
    addressService,
    caseAdminCaseloadService,
    residentialChecksService,
  )
  get(paths.probation.assessment.reviewInformation, reviewInformationRoutes.GET)
  post(paths.probation.assessment.reviewInformation, reviewInformationRoutes.POST)

  const nonDisclosableInformationRoutes = new NonDisclosableInformationRoutes(
    communityOffenderManagerCaseloadService,
    nonDisclosableInformationService,
  )
  get(paths.probation.assessment.nonDisclosableInformation, nonDisclosableInformationRoutes.GET)
  post(paths.probation.assessment.nonDisclosableInformation, nonDisclosableInformationRoutes.POST)

  return router
}
