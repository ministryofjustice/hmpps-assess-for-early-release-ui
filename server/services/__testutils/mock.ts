import { CaseAdminCaseloadService } from '..'

jest.mock('..')

const createMockCaseAdminCaseloadService = () =>
  new CaseAdminCaseloadService(null) as jest.Mocked<CaseAdminCaseloadService>

export default createMockCaseAdminCaseloadService
