import { dataAccess, hmppsComponentsClientBuilder } from '../data'
import AuditService from './auditService'
import CaseAdminCaseloadService from './caseAdminCaseloadService'
import EligibilityAndSuitabilityService from './eligiblityAndSuitabilityService'
import HmppsComponentsService from './hmppsComponentsService'
import OptOutService from './optOutService'
import AddressService from './addressService'
import CommunityOffenderManagerCaseloadService from './communityOffenderManagerCaseloadService'
import UserService from './userService'

export const services = () => {
  const { hmppsAuditClient, assessForEarlyReleaseApiClientBuilder, hmppsAuthClient } = dataAccess
  const addressService = new AddressService(assessForEarlyReleaseApiClientBuilder)
  const auditService = new AuditService(hmppsAuditClient)
  const hmppsComponentsService = new HmppsComponentsService(hmppsComponentsClientBuilder)
  const caseAdminCaseloadService = new CaseAdminCaseloadService(assessForEarlyReleaseApiClientBuilder)
  const eligibilityAndSuitabilityService = new EligibilityAndSuitabilityService(assessForEarlyReleaseApiClientBuilder)
  const optOutService = new OptOutService(assessForEarlyReleaseApiClientBuilder)
  const communityOffenderManagerCaseloadService = new CommunityOffenderManagerCaseloadService(
    assessForEarlyReleaseApiClientBuilder,
  )
  const userService = new UserService(assessForEarlyReleaseApiClientBuilder)

  return {
    addressService,
    auditService,
    hmppsComponentsService,
    caseAdminCaseloadService,
    hmppsAuthClient,
    optOutService,
    eligibilityAndSuitabilityService,
    communityOffenderManagerCaseloadService,
    userService,
  }
}

export type Services = ReturnType<typeof services>

export {
  HmppsComponentsService,
  AddressService,
  CaseAdminCaseloadService,
  OptOutService,
  EligibilityAndSuitabilityService,
  CommunityOffenderManagerCaseloadService,
  UserService,
}
