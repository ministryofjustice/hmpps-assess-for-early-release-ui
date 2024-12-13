import { dataAccess, hmppsComponentsClientBuilder } from '../data'
import AuditService from './auditService'
import CaseAdminCaseloadService from './caseAdminCaseloadService'
import EligibilityAndSuitabilityService from './eligiblityAndSuitabilityService'
import HmppsComponentsService from './hmppsComponentsService'
import OptOutService from './optOutService'
import AddressService from './addressService'
import CommunityOffenderManagerCaseloadService from './communityOffenderManagerCaseloadService'
import UserService from './userService'
import ResidentialChecksService from './residentialChecksService'
import DecisionMakerCaseloadService from './decisionMakerCaseloadService'

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
  const residentialChecksService = new ResidentialChecksService(assessForEarlyReleaseApiClientBuilder)
  const userService = new UserService(assessForEarlyReleaseApiClientBuilder)
  const decisionMakerCaseloadService = new DecisionMakerCaseloadService(assessForEarlyReleaseApiClientBuilder)

  return {
    addressService,
    auditService,
    caseAdminCaseloadService,
    communityOffenderManagerCaseloadService,
    eligibilityAndSuitabilityService,
    hmppsAuthClient,
    hmppsComponentsService,
    optOutService,
    residentialChecksService,
    userService,
    decisionMakerCaseloadService,
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
}
