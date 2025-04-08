import { dataAccess } from '../data'
import AuditService from './auditService'
import CaseAdminCaseloadService from './caseAdminCaseloadService'
import EligibilityAndSuitabilityService from './eligibilityAndSuitabilityService'
import HmppsComponentsService from './hmppsComponentsService'
import OptOutService from './optOutService'
import AddressService from './addressService'
import CommunityOffenderManagerCaseloadService from './communityOffenderManagerCaseloadService'
import UserService from './userService'
import ResidentialChecksService from './residentialChecksService'
import DecisionMakerCaseloadService from './decisionMakerCaseloadService'
import FormService from './formService'
import SupportService from './supportService'

export const services = () => {
  const { hmppsAuditClient, assessForEarlyReleaseApiClient, hmppsComponentsClient, aferSupportApiClient } = dataAccess
  const addressService = new AddressService(assessForEarlyReleaseApiClient)
  const auditService = new AuditService(hmppsAuditClient)
  const hmppsComponentsService = new HmppsComponentsService(hmppsComponentsClient)
  const caseAdminCaseloadService = new CaseAdminCaseloadService(assessForEarlyReleaseApiClient)
  const eligibilityAndSuitabilityService = new EligibilityAndSuitabilityService(assessForEarlyReleaseApiClient)
  const optOutService = new OptOutService(assessForEarlyReleaseApiClient)
  const communityOffenderManagerCaseloadService = new CommunityOffenderManagerCaseloadService(
    assessForEarlyReleaseApiClient,
  )
  const residentialChecksService = new ResidentialChecksService(assessForEarlyReleaseApiClient)
  const userService = new UserService(assessForEarlyReleaseApiClient)
  const decisionMakerCaseloadService = new DecisionMakerCaseloadService(assessForEarlyReleaseApiClient)
  const formService = new FormService(assessForEarlyReleaseApiClient)
  const supportService = new SupportService(aferSupportApiClient, assessForEarlyReleaseApiClient)

  return {
    dataAccess,
    addressService,
    auditService,
    caseAdminCaseloadService,
    communityOffenderManagerCaseloadService,
    eligibilityAndSuitabilityService,
    hmppsComponentsService,
    optOutService,
    residentialChecksService,
    userService,
    decisionMakerCaseloadService,
    formService,
    supportService,
  }
}

export type Services = ReturnType<typeof services>

export {
  AddressService,
  CaseAdminCaseloadService,
  CommunityOffenderManagerCaseloadService,
  EligibilityAndSuitabilityService,
  HmppsComponentsService,
  OptOutService,
  ResidentialChecksService,
  UserService,
  DecisionMakerCaseloadService,
  FormService,
}
