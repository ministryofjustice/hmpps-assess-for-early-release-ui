import { dataAccess } from '../data'
import AuditService from './auditService'
import CaseAdminCaseloadService from './caseAdminCaseloadService'
import EligibilityAndSuitabilityService from './eligibilityAndSuitabilityService'
import HmppsComponentsService from './hmppsComponentsService'
import OptInOutService from './optInOutService'
import AddressService from './addressService'
import CommunityOffenderManagerCaseloadService from './communityOffenderManagerCaseloadService'
import UserService from './userService'
import ResidentialChecksService from './residentialChecksService'
import DecisionMakerCaseloadService from './decisionMakerCaseloadService'
import FormService from './formService'
import SupportService from './supportService'
import NonDisclosableInformationService from './nonDisclosableInformationService'
import ComChecksService from './comChecksService'

export const services = () => {
  const { hmppsAuditClient, assessForEarlyReleaseApiClient, hmppsComponentsClient, aferSupportApiClient } = dataAccess
  const addressService = new AddressService(assessForEarlyReleaseApiClient)
  const auditService = new AuditService(hmppsAuditClient)
  const comChecksService = new ComChecksService(assessForEarlyReleaseApiClient)
  const hmppsComponentsService = new HmppsComponentsService(hmppsComponentsClient)
  const caseAdminCaseloadService = new CaseAdminCaseloadService(assessForEarlyReleaseApiClient)
  const eligibilityAndSuitabilityService = new EligibilityAndSuitabilityService(assessForEarlyReleaseApiClient)
  const optInOutService = new OptInOutService(assessForEarlyReleaseApiClient)
  const communityOffenderManagerCaseloadService = new CommunityOffenderManagerCaseloadService(
    assessForEarlyReleaseApiClient,
  )
  const residentialChecksService = new ResidentialChecksService(assessForEarlyReleaseApiClient)
  const userService = new UserService(assessForEarlyReleaseApiClient)
  const decisionMakerCaseloadService = new DecisionMakerCaseloadService(assessForEarlyReleaseApiClient)
  const formService = new FormService(assessForEarlyReleaseApiClient)
  const supportService = new SupportService(aferSupportApiClient, assessForEarlyReleaseApiClient)
  const nonDisclosableInformationService = new NonDisclosableInformationService(assessForEarlyReleaseApiClient)

  return {
    dataAccess,
    addressService,
    auditService,
    caseAdminCaseloadService,
    communityOffenderManagerCaseloadService,
    comChecksService,
    eligibilityAndSuitabilityService,
    hmppsComponentsService,
    optInOutService,
    residentialChecksService,
    userService,
    decisionMakerCaseloadService,
    formService,
    supportService,
    nonDisclosableInformationService,
  }
}

export type Services = ReturnType<typeof services>

export {
  AddressService,
  CaseAdminCaseloadService,
  CommunityOffenderManagerCaseloadService,
  ComChecksService,
  EligibilityAndSuitabilityService,
  HmppsComponentsService,
  OptInOutService,
  ResidentialChecksService,
  UserService,
  DecisionMakerCaseloadService,
  FormService,
  NonDisclosableInformationService,
}
