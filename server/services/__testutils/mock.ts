import { AddressService, CaseAdminCaseloadService, EligibilityAndSuitabilityService } from '..'

jest.mock('..')

const createMockAddressService = () => new AddressService(null) as jest.Mocked<AddressService>

const createMockCaseAdminCaseloadService = () =>
  new CaseAdminCaseloadService(null) as jest.Mocked<CaseAdminCaseloadService>

const createMockEligibilityAndSuitabilityService = () =>
  new EligibilityAndSuitabilityService(null) as jest.Mocked<EligibilityAndSuitabilityService>

export { createMockAddressService, createMockCaseAdminCaseloadService, createMockEligibilityAndSuitabilityService }
