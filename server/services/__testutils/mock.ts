import { CaseAdminCaseloadService, EligibilityAndSuitabilityService } from '..'

jest.mock('..')

const createMockCaseAdminCaseloadService = () =>
  new CaseAdminCaseloadService(null) as jest.Mocked<CaseAdminCaseloadService>

const createMockEligibilityAndSuitabilityService = () =>
  new EligibilityAndSuitabilityService(null) as jest.Mocked<EligibilityAndSuitabilityService>

export { createMockCaseAdminCaseloadService, createMockEligibilityAndSuitabilityService }
