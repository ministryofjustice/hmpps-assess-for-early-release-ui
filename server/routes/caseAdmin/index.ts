import { RequestHandler, Router } from 'express'
import { Path } from 'static-path'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import roleCheckMiddleware from '../../middleware/roleCheckMiddleware'
import AuthRole from '../../enumeration/authRole'
import CaseloadRoutes from './caseload'
import { Services } from '../../services'
import AssessmentRoutes from './assessment'
import EligibilityAndSuitabilityQuestionListHandler from './initialChecks/eligibilityAndSuitabilityQuestionListHandler'
import CheckRoutes from './initialChecks/check'
import paths from '../paths'
import setAgentRoleMiddleware from '../../middleware/setAgentRoleMiddleware'
import FindAddressRoutes from './curfewAddress/findAddress'
import SelectAddressRoutes from './curfewAddress/selectAddress'
import NoAddressFoundRoutes from './curfewAddress/noAddressFound'
import AddResidentDetailsRoutes from './curfewAddress/addResidentDetails'
import MoreInfoRequiredCheckRoutes from './curfewAddress/moreInfoRequiredCheck'
import RequestMoreAddressChecksRoutes from './curfewAddress/requestMoreAddressChecks'
import CheckYourAnswersRoutes from './curfewAddress/checkYourAnswers'
import OptOutCheckRoutes from './optInOut/optOutCheck'
import OptOutRoutes from './optInOut/optOut'
import ChecksCompleteRoutes from './initialChecks/checksComplete'
import OptInRoutes from './optInOut/optIn'
import AddressDeleteReasonRoutes from './curfewAddress/addressDeleteReason'

export default function Index({
  caseAdminCaseloadService,
  eligibilityAndSuitabilityService,
  addressService,
  optInOutService,
}: Services): Router {
  const router = Router()

  const get = <T extends string>(routerPath: Path<T>, handler: RequestHandler) =>
    router.get(
      routerPath.pattern,
      setAgentRoleMiddleware('PRISON_CA'),
      roleCheckMiddleware([AuthRole.CASE_ADMIN]),
      asyncMiddleware(handler),
    )
  const post = <T extends string>(routerPath: Path<T>, handler: RequestHandler) =>
    router.post(
      routerPath.pattern,
      setAgentRoleMiddleware('PRISON_CA'),
      roleCheckMiddleware([AuthRole.CASE_ADMIN]),
      asyncMiddleware(handler),
    )

  const supportHomeHandler = new CaseloadRoutes(caseAdminCaseloadService)
  get(paths.prison.prisonCaseload, supportHomeHandler.GET)

  const assessmentHandler = new AssessmentRoutes(caseAdminCaseloadService)
  get(paths.prison.assessment.home, assessmentHandler.GET)

  const eligibilityAndSuitabilityQuestionListHandler = new EligibilityAndSuitabilityQuestionListHandler(
    eligibilityAndSuitabilityService,
  )
  get(
    paths.prison.assessment.initialChecks.eligibilityAndSuitabilityQuestionList,
    eligibilityAndSuitabilityQuestionListHandler.GET,
  )

  const checkRoutes = new CheckRoutes(eligibilityAndSuitabilityService)
  get(paths.prison.assessment.initialChecks.check, checkRoutes.GET)
  post(paths.prison.assessment.initialChecks.check, checkRoutes.POST)

  const checksCompleteRoutes = new ChecksCompleteRoutes(eligibilityAndSuitabilityService)
  get(paths.prison.assessment.initialChecks.checksComplete, checksCompleteRoutes.GET)

  const findAddressHandler = new FindAddressRoutes(addressService, caseAdminCaseloadService)
  get(paths.prison.assessment.enterCurfewAddressOrCasArea.findAddress, findAddressHandler.GET)
  post(paths.prison.assessment.enterCurfewAddressOrCasArea.findAddress, findAddressHandler.POST)

  const selectAddressHandler = new SelectAddressRoutes(addressService, caseAdminCaseloadService)
  get(paths.prison.assessment.enterCurfewAddressOrCasArea.selectAddress, selectAddressHandler.GET)
  post(paths.prison.assessment.enterCurfewAddressOrCasArea.selectAddress, selectAddressHandler.POST)

  const noAddressFoundHandler = new NoAddressFoundRoutes(caseAdminCaseloadService)
  get(paths.prison.assessment.enterCurfewAddressOrCasArea.noAddressFound, noAddressFoundHandler.GET)

  const addResidentDetailsHandler = new AddResidentDetailsRoutes(addressService, caseAdminCaseloadService)
  get(paths.prison.assessment.enterCurfewAddressOrCasArea.addResidentDetails, addResidentDetailsHandler.GET)
  post(paths.prison.assessment.enterCurfewAddressOrCasArea.addResidentDetails, addResidentDetailsHandler.POST)

  const moreInfoRequiredCheckHandler = new MoreInfoRequiredCheckRoutes(caseAdminCaseloadService, addressService)
  get(
    paths.prison.assessment.enterCurfewAddressOrCasArea.moreInformationRequiredCheck,
    moreInfoRequiredCheckHandler.GET,
  )
  post(
    paths.prison.assessment.enterCurfewAddressOrCasArea.moreInformationRequiredCheck,
    moreInfoRequiredCheckHandler.POST,
  )

  const requestMoreAddressChecksRoutes = new RequestMoreAddressChecksRoutes(addressService, caseAdminCaseloadService)
  get(paths.prison.assessment.enterCurfewAddressOrCasArea.requestMoreAddressChecks, requestMoreAddressChecksRoutes.GET)
  post(
    paths.prison.assessment.enterCurfewAddressOrCasArea.requestMoreAddressChecks,
    requestMoreAddressChecksRoutes.POST,
  )
  get(
    paths.prison.assessment.enterCurfewAddressOrCasArea.deleteAddressCheckRequest,
    requestMoreAddressChecksRoutes.DELETE,
  )

  const checkYourAnswersRoutes = new CheckYourAnswersRoutes(addressService, caseAdminCaseloadService)
  get(paths.prison.assessment.enterCurfewAddressOrCasArea.checkYourAnswers, checkYourAnswersRoutes.GET)
  post(paths.prison.assessment.enterCurfewAddressOrCasArea.checkYourAnswers, checkYourAnswersRoutes.POST)
  get(paths.prison.assessment.enterCurfewAddressOrCasArea.deleteCheckYourAnswers, checkYourAnswersRoutes.DELETE)

  const optOutCheckHandler = new OptOutCheckRoutes(caseAdminCaseloadService)
  get(paths.prison.assessment.enterCurfewAddressOrCasArea.optOutCheck, optOutCheckHandler.GET)
  post(paths.prison.assessment.enterCurfewAddressOrCasArea.optOutCheck, optOutCheckHandler.POST)

  const optOutHandler = new OptOutRoutes(caseAdminCaseloadService, optInOutService)
  get(paths.prison.assessment.enterCurfewAddressOrCasArea.optOut, optOutHandler.GET)
  post(paths.prison.assessment.enterCurfewAddressOrCasArea.optOut, optOutHandler.POST)

  const optInHandler = new OptInRoutes(caseAdminCaseloadService, optInOutService)
  get(paths.prison.assessment.enterCurfewAddressOrCasArea.optIn, optInHandler.GET)
  post(paths.prison.assessment.enterCurfewAddressOrCasArea.optIn, optInHandler.POST)

  const addressDeleteReason = new AddressDeleteReasonRoutes(addressService, caseAdminCaseloadService)
  get(paths.prison.assessment.addressDeleteReason, addressDeleteReason.GET)
  post(paths.prison.assessment.addressDeleteReason, addressDeleteReason.POST)

  return router
}
