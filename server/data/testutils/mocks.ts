import { AssessForEarlyReleaseApiClient } from '..'

jest.mock('..')

const createAssessForEarlyReleaseApiClient = () =>
  new AssessForEarlyReleaseApiClient(null) as jest.Mocked<AssessForEarlyReleaseApiClient>

export default createAssessForEarlyReleaseApiClient
