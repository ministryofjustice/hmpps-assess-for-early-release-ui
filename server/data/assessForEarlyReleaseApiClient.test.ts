import nock from 'nock'
import config from '../config'
import { AssessForEarlyReleaseApiClient } from '.'
import { AssessmentSummary, OffenderSummary } from '../@types/assessForEarlyReleaseApiClientTypes'
import { createAssessmentSummary, createOffenderSummary, createInitialChecks } from './__testutils/testObjects'

describe('feComponentsClient', () => {
  let fakeComponentsApi: nock.Scope
  let assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient
  const token = 'TOKEN-1'

  beforeEach(() => {
    fakeComponentsApi = nock(config.apis.assessForEarlyReleaseApi.url)
    assessForEarlyReleaseApiClient = new AssessForEarlyReleaseApiClient(token)
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('getCaseAdminCaseload', () => {
    const offenderSummaryList = [createOffenderSummary({})]

    it('should return data from api', async () => {
      const prisonCode = 'MDI'
      const response: OffenderSummary[] = offenderSummaryList
      const request: OffenderSummary[] = offenderSummaryList.map(c => {
        return { ...c, hdced: '2022-08-01' }
      })

      fakeComponentsApi
        .get(`/prison/${prisonCode}/case-admin/caseload`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, request)

      const output = await assessForEarlyReleaseApiClient.getCaseAdminCaseload(prisonCode)
      expect(output).toEqual(response)
    })
  })

  describe('getAssessmentSummary', () => {
    const assessmentSummary = createAssessmentSummary({})

    it('should return data from api', async () => {
      const { prisonNumber } = assessmentSummary
      const response: AssessmentSummary = assessmentSummary
      const request: AssessmentSummary = { ...assessmentSummary, hdced: '2024-10-10', crd: '2024-10-10' }

      fakeComponentsApi
        .get(`/offender/${prisonNumber}/current-assessment`)
        .matchHeader('authorization', `Bearer ${token}`)
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
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, request)

      const output = await assessForEarlyReleaseApiClient.getAssessmentSummary(prisonNumber)
      expect(output).toEqual({ ...response, crd: 'not found' })
    })
  })

  describe('getInitialCheckStatus', () => {
    const initialChecks = createInitialChecks()
    const { prisonNumber } = initialChecks.assessmentSummary

    it('should return data from api', async () => {
      fakeComponentsApi
        .get(`/offender/${prisonNumber}/current-assessment/initial-checks`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, initialChecks)

      const output = await assessForEarlyReleaseApiClient.getInitialCheckStatus(prisonNumber)
      expect(output).toEqual(initialChecks)
    })
  })
})
