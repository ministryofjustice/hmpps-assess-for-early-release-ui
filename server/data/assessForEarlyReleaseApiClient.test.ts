import nock from 'nock'
import config from '../config'
import { AssessForEarlyReleaseApiClient } from '.'
import { _AssessmentSummary, _OffenderSummary } from '../@types/assessForEarlyReleaseApiClientTypes'
import { createAssessmentSummary, createOffenderSummary, createInitialChecks } from './__testutils/testObjects'
import { toIsoDate } from '../utils/utils'

describe('assessForEarlyReleaseApiClient', () => {
  let fakeAferApi: nock.Scope
  let assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient
  const token = 'TOKEN-1'

  beforeEach(() => {
    fakeAferApi = nock(config.apis.assessForEarlyReleaseApi.url)
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
      const apiResponse: _OffenderSummary[] = offenderSummaryList.map(c => {
        return { ...c, hdced: toIsoDate(c.hdced) }
      })

      fakeAferApi
        .get(`/prison/${prisonCode}/case-admin/caseload`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, apiResponse)

      const output = await assessForEarlyReleaseApiClient.getCaseAdminCaseload(prisonCode)
      expect(output).toEqual(offenderSummaryList)
    })
  })

  describe('getAssessmentSummary', () => {
    const assessmentSummary = createAssessmentSummary({})

    it('should return data from api', async () => {
      const { prisonNumber } = assessmentSummary
      const apiResponse: _AssessmentSummary = {
        ...assessmentSummary,
        hdced: toIsoDate(assessmentSummary.hdced),
        crd: toIsoDate(assessmentSummary.crd),
      }

      fakeAferApi
        .get(`/offender/${prisonNumber}/current-assessment`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, apiResponse)

      const output = await assessForEarlyReleaseApiClient.getAssessmentSummary(prisonNumber)
      expect(output).toEqual(assessmentSummary)
    })

    it('should return crd as not found if crd is empty', async () => {
      const { prisonNumber } = assessmentSummary
      const apiResponse: _AssessmentSummary = {
        ...assessmentSummary,
        hdced: toIsoDate(assessmentSummary.hdced),
        crd: null,
      }

      fakeAferApi
        .get(`/offender/${prisonNumber}/current-assessment`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, apiResponse)

      const output = await assessForEarlyReleaseApiClient.getAssessmentSummary(prisonNumber)
      expect(output).toEqual({ ...assessmentSummary, crd: null })
    })
  })

  describe('getInitialCheckStatus', () => {
    const initialChecks = createInitialChecks()
    const { prisonNumber } = initialChecks.assessmentSummary

    it('should return data from api', async () => {
      const apiResponse = {
        ...initialChecks,
        assessmentSummary: {
          ...initialChecks.assessmentSummary,
          hdced: toIsoDate(initialChecks.assessmentSummary.hdced),
          crd: toIsoDate(initialChecks.assessmentSummary.crd),
        },
      }

      fakeAferApi
        .get(`/offender/${prisonNumber}/current-assessment/initial-checks`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, apiResponse)

      const output = await assessForEarlyReleaseApiClient.getInitialCheckStatus(prisonNumber)
      expect(output).toEqual(initialChecks)
    })
  })

  describe('optOut', () => {
    const initialChecks = createInitialChecks()
    const { prisonNumber } = initialChecks.assessmentSummary

    it('should opt out', async () => {
      fakeAferApi
        .put(`/offender/${prisonNumber}/current-assessment/opt-out`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200)

      await assessForEarlyReleaseApiClient.optOut(prisonNumber, { reasonType: 'NOWHERE_TO_STAY' })
      expect(fakeAferApi.isDone()).toBe(true)
    })
  })
})
