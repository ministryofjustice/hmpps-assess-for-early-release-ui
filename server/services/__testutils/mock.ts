import {
  AddressService,
  CaseAdminCaseloadService,
  CommunityOffenderManagerCaseloadService,
  DecisionMakerCaseloadService,
  EligibilityAndSuitabilityService,
  ResidentialChecksService,
  UserService,
  FormService,
} from '..'

jest.mock('..')

const createMockAddressService = () => new AddressService(null) as jest.Mocked<AddressService>

const createMockCaseAdminCaseloadService = () =>
  new CaseAdminCaseloadService(null) as jest.Mocked<CaseAdminCaseloadService>

const createMockCommunityOffenderManagerCaseloadService = () =>
  new CommunityOffenderManagerCaseloadService(null) as jest.Mocked<CommunityOffenderManagerCaseloadService>

const createMockEligibilityAndSuitabilityService = () =>
  new EligibilityAndSuitabilityService(null) as jest.Mocked<EligibilityAndSuitabilityService>

const createMockUserService = () => new UserService(null) as jest.Mocked<UserService>

const createMockResidentialChecksService = () =>
  new ResidentialChecksService(null) as jest.Mocked<ResidentialChecksService>

const createMockDecisionMakerCaseloadService = () =>
  new DecisionMakerCaseloadService(null) as jest.Mocked<DecisionMakerCaseloadService>

const createMockFormService = () => new FormService(null) as jest.Mocked<FormService>

export {
  createMockAddressService,
  createMockCaseAdminCaseloadService,
  createMockEligibilityAndSuitabilityService,
  createMockResidentialChecksService,
  createMockUserService,
  createMockCommunityOffenderManagerCaseloadService,
  createMockDecisionMakerCaseloadService,
  createMockFormService,
}
