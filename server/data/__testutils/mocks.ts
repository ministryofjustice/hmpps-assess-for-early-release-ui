import { AssessForEarlyReleaseApiClient, HmppsAuthClient } from '..'

jest.mock('..')

const createAssessForEarlyReleaseApiClient = () =>
  new AssessForEarlyReleaseApiClient(null) as jest.Mocked<AssessForEarlyReleaseApiClient>

const createMockHmppsAuthClient = () => new HmppsAuthClient(null) as jest.Mocked<HmppsAuthClient>

export { createAssessForEarlyReleaseApiClient, createMockHmppsAuthClient }
