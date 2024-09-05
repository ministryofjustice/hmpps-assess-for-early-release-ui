import nock from 'nock'
import config from '../config'
import { AssessForEarlyReleaseApiClient } from '.'
import { OffenderSummary } from '../@types/assessForEarlyReleaseApiClientTypes'
import { createOffenderSummary } from './__testutils/testObjects'
import { mockRequest } from '../routes/__testutils/requestTestUtils'

describe('feComponentsClient', () => {
  let fakeComponentsApi: nock.Scope
  let assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient
  const offenderSummaryList = [createOffenderSummary({})]
  const req = mockRequest({})

  beforeEach(() => {
    fakeComponentsApi = nock(config.apis.assessForEarlyReleaseApi.url)
    assessForEarlyReleaseApiClient = new AssessForEarlyReleaseApiClient(req.middleware.clientToken)
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('getComponents', () => {
    it('should return data from api', async () => {
      const prisonCode = 'MDI'
      const response: { data: OffenderSummary[] } = {
        data: offenderSummaryList,
      }

      fakeComponentsApi
        .get(`/prison/${prisonCode}/case-admin/caseload`)
        .matchHeader('authorization', `Bearer ${req.middleware.clientToken}`)
        .reply(200, response)

      const output = await assessForEarlyReleaseApiClient.getCaseAdminCaseload(prisonCode)
      expect(output).toEqual(response)
    })
  })
})
