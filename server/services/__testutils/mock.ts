import { AddressService, CaseAdminCaseloadService, EligibilityAndSuitabilityService, UserService } from '..'

jest.mock('..')

const createMockAddressService = () => new AddressService(null) as jest.Mocked<AddressService>

const createMockCaseAdminCaseloadService = () =>
  new CaseAdminCaseloadService(null) as jest.Mocked<CaseAdminCaseloadService>

const createMockEligibilityAndSuitabilityService = () =>
  new EligibilityAndSuitabilityService(null) as jest.Mocked<EligibilityAndSuitabilityService>

const createMockUserService = () => new UserService(null) as jest.Mocked<UserService>

export {
  createMockAddressService,
  createMockCaseAdminCaseloadService,
  createMockEligibilityAndSuitabilityService,
  createMockUserService,
}
