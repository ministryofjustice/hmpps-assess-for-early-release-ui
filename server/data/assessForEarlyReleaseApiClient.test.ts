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
  const assessmentSummary = createAssessmentSummary({})
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
      const response: OffenderSummary[] = offenderSummaryList
      const request: OffenderSummary[] = offenderSummaryList.map(c => {
        return { ...c, hdced: '2022-08-01' }
      })

      fakeComponentsApi
        .get(`/prison/${prisonCode}/case-admin/caseload`)
        .matchHeader('authorization', `Bearer ${req.middleware.clientToken}`)
        .reply(200, request)

      const output = await assessForEarlyReleaseApiClient.getCaseAdminCaseload(prisonCode)
      expect(output).toEqual(response)
    })
  })

  describe('getAssessmentSummary', () => {
    it('should return data from api', async () => {
      const { prisonNumber } = assessmentSummary
      const response: AssessmentSummary = assessmentSummary
      const request: AssessmentSummary = { ...assessmentSummary, hdced: '2024-10-10', crd: '2024-10-10' }

      fakeComponentsApi
        .get(`/offender/${prisonNumber}/current-assessment`)
        .matchHeader('authorization', `Bearer ${req.middleware.clientToken}`)
        .reply(200, request)

      const output = await assessForEarlyReleaseApiClient.getAssessmentSummary(prisonNumber)
      expect(output).toEqual(response)
    })

    it('should return crd as not found if crd is empty', async () => {
      const { prisonNumber } = assessmentSummary
      const response: AssessmentSummary = { ...assessmentSummary, crd: null }
      const request: AssessmentSummary = { ...assessmentSummary, hdced: '2024-10-10', crd: null }

      fakeComponentsApi
        .get(`/offender/${prisonNumber}/current-assessment`)
        .matchHeader('authorization', `Bearer ${req.middleware.clientToken}`)
        .reply(200, request)

      const output = await assessForEarlyReleaseApiClient.getAssessmentSummary(prisonNumber)
      expect(output).toEqual({ ...response, crd: 'not found' })
    })
  })
})
