import nock from 'nock'
import config from '../config'
import { AssessForEarlyReleaseApiClient } from '.'
import { AssessmentSummary, OffenderSummary } from '../@types/assessForEarlyReleaseApiClientTypes'
import { createAssessmentSummary, createOffenderSummary } from './__testutils/testObjects'
import { mockRequest } from '../routes/__testutils/requestTestUtils'

describe('feComponentsClient', () => {
  let fakeComponentsApi: nock.Scope
  let assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient
  const offenderSummaryList = [createOffenderSummary({})]
  const assessmentSummaryList = [createAssessmentSummary({})]
  const req = mockRequest({})

  beforeEach(() => {
    fakeComponentsApi = nock(config.apis.assessForEarlyReleaseApi.url)
    assessForEarlyReleaseApiClient = new AssessForEarlyReleaseApiClient(req.middleware.clientToken)
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('getCaseAdminCaseload', () => {
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

  describe('getAssessmentSummary', () => {
    it('should return data from api', async () => {
      const { prisonNumber } = assessmentSummaryList[0]
      const response: { data: AssessmentSummary[] } = {
        data: assessmentSummaryList,
      }

      fakeComponentsApi
        .get(`/offender/${prisonNumber}/current-assessment`)
        .matchHeader('authorization', `Bearer ${req.middleware.clientToken}`)
        .reply(200, response)

      const output = await assessForEarlyReleaseApiClient.getAssessmentSummary(prisonNumber)
      expect(output).toEqual(response)
    })
  })
})
