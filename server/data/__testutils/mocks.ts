import { AssessForEarlyReleaseApiClient, AuthenticationClient } from '..'

jest.mock('..')

const createAssessForEarlyReleaseApiClient = () =>
  new AssessForEarlyReleaseApiClient(null) as jest.Mocked<AssessForEarlyReleaseApiClient>

const createMockAuthenticationClient = () =>
  new AuthenticationClient(null, null, null) as jest.Mocked<AuthenticationClient>

export { createAssessForEarlyReleaseApiClient, createMockAuthenticationClient }
