import nock from 'nock'
import config from '../config'
import { AssessForEarlyReleaseApiClient } from '.'
import { _AssessmentSummary, _OffenderSummary } from '../@types/assessForEarlyReleaseApiClientTypes'
import {
  createAssessmentSummary,
  createOffenderSummary,
  createEligibilityAndSuitabilityCaseView,
  createEligibilityCriterionView,
  createEligibilityCriterionProgress,
  createSuitabilityCriterionView,
  createSuitabilityCriterionProgress,
} from './__testutils/testObjects'
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
        dateOfBirth: toIsoDate(assessmentSummary.dateOfBirth),
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
        dateOfBirth: toIsoDate(assessmentSummary.dateOfBirth),
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

  describe('getEligibilityCriteriaView', () => {
    const view = createEligibilityAndSuitabilityCaseView()
    const { prisonNumber } = view.assessmentSummary

    it('should return data from api', async () => {
      const apiResponse = {
        ...view,
        assessmentSummary: {
          ...view.assessmentSummary,
          dateOfBirth: toIsoDate(view.assessmentSummary.dateOfBirth),
          hdced: toIsoDate(view.assessmentSummary.hdced),
          crd: toIsoDate(view.assessmentSummary.crd),
        },
      }

      fakeAferApi
        .get(`/offender/${prisonNumber}/current-assessment/eligibility-and-suitability`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, apiResponse)

      const output = await assessForEarlyReleaseApiClient.getEligibilityCriteriaView(prisonNumber)
      expect(output).toEqual(view)
    })
  })

  describe('getEligibilityCriterionView', () => {
    const criterion = createEligibilityCriterionProgress({ code: 'code-1' })
    const nextCriterion = createEligibilityCriterionProgress({ code: 'code-2' })
    const criterionView = createEligibilityCriterionView({ criterion, nextCriterion })

    const { prisonNumber } = criterionView.assessmentSummary

    it('should return data from api', async () => {
      const apiResponse = {
        ...criterionView,
        assessmentSummary: {
          ...criterionView.assessmentSummary,
          dateOfBirth: toIsoDate(criterionView.assessmentSummary.dateOfBirth),
          hdced: toIsoDate(criterionView.assessmentSummary.hdced),
          crd: toIsoDate(criterionView.assessmentSummary.crd),
        },
      }

      fakeAferApi
        .get(`/offender/${prisonNumber}/current-assessment/eligibility/${criterion.code}`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, apiResponse)

      const output = await assessForEarlyReleaseApiClient.getEligibilityCriterionView(prisonNumber, 'code-1')
      expect(output).toEqual(criterionView)
    })
  })

  describe('getSuitabilityCriterionView', () => {
    const criterion = createSuitabilityCriterionProgress({ code: 'code-1' })
    const nextCriterion = createSuitabilityCriterionProgress({ code: 'code-2' })
    const criterionView = createSuitabilityCriterionView({ criterion, nextCriterion })

    const { prisonNumber } = criterionView.assessmentSummary

    it('should return data from api', async () => {
      const apiResponse = {
        ...criterionView,
        assessmentSummary: {
          ...criterionView.assessmentSummary,
          dateOfBirth: toIsoDate(criterionView.assessmentSummary.dateOfBirth),
          hdced: toIsoDate(criterionView.assessmentSummary.hdced),
          crd: toIsoDate(criterionView.assessmentSummary.crd),
        },
      }

      fakeAferApi
        .get(`/offender/${prisonNumber}/current-assessment/suitability/${criterion.code}`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, apiResponse)

      const output = await assessForEarlyReleaseApiClient.getSuitabilityCriterionView(prisonNumber, 'code-1')
      expect(output).toEqual(criterionView)
    })
  })

  describe('optOut', () => {
    const initialChecks = createEligibilityAndSuitabilityCaseView()
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
