import nock from 'nock'
import config from '../config'
import { AssessForEarlyReleaseApiClient } from '.'
import {
  _AssessmentOverviewSummary,
  _OffenderSummary,
  _ResidentialChecksTaskView,
  Agent,
  SaveResidentialChecksTaskAnswersRequest,
} from '../@types/assessForEarlyReleaseApiClientTypes'
import {
  createAssessmentOverviewSummary,
  createOffenderSummary,
  createEligibilityAndSuitabilityCaseView,
  createEligibilityCriterionView,
  createEligibilityCriterionProgress,
  createSuitabilityCriterionView,
  createSuitabilityCriterionProgress,
  createResidentialChecksView,
  createResidentialChecksTaskView,
  createAgent,
} from './__testutils/testObjects'
import { toIsoDate } from '../utils/utils'

describe('assessForEarlyReleaseApiClient', () => {
  let fakeAferApi: nock.Scope
  let assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient
  const token = 'TOKEN-1'
  const agent = createAgent() as Agent

  beforeEach(() => {
    fakeAferApi = nock(config.apis.assessForEarlyReleaseApi.url)
    assessForEarlyReleaseApiClient = new AssessForEarlyReleaseApiClient(null)
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
        return {
          ...c,
          hdced: toIsoDate(c.hdced),
          postponementDate: toIsoDate(c.postponementDate),
          taskOverdueOn: toIsoDate(c.taskOverdueOn),
        }
      })

      fakeAferApi
        .get(`/prison/${prisonCode}/case-admin/caseload`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, apiResponse)

      const output = await assessForEarlyReleaseApiClient.getCaseAdminCaseload(token, agent, prisonCode)
      expect(output).toEqual(offenderSummaryList)
    })
  })

  describe('getAssessmentSummary', () => {
    const assessmentOverviewSummary = createAssessmentOverviewSummary({})

    it('should return data from api', async () => {
      const { prisonNumber } = assessmentOverviewSummary
      const apiResponse: _AssessmentOverviewSummary = {
        ...assessmentOverviewSummary,
        dateOfBirth: toIsoDate(assessmentOverviewSummary.dateOfBirth),
        hdced: toIsoDate(assessmentOverviewSummary.hdced),
        crd: toIsoDate(assessmentOverviewSummary.crd),
        toDoEligibilityAndSuitabilityBy: toIsoDate(assessmentOverviewSummary.toDoEligibilityAndSuitabilityBy),
      }

      fakeAferApi
        .get(`/offender/${prisonNumber}/current-assessment`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, apiResponse)

      const output = await assessForEarlyReleaseApiClient.getAssessmentOverviewSummary(token, agent, prisonNumber)
      expect(output).toEqual(assessmentOverviewSummary)
    })

    it('should return crd as not found if crd is empty', async () => {
      const { prisonNumber } = assessmentOverviewSummary
      const apiResponse: _AssessmentOverviewSummary = {
        ...assessmentOverviewSummary,
        dateOfBirth: toIsoDate(assessmentOverviewSummary.dateOfBirth),
        hdced: toIsoDate(assessmentOverviewSummary.hdced),
        crd: null,
        toDoEligibilityAndSuitabilityBy: toIsoDate(assessmentOverviewSummary.toDoEligibilityAndSuitabilityBy),
      }

      fakeAferApi
        .get(`/offender/${prisonNumber}/current-assessment`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, apiResponse)

      const output = await assessForEarlyReleaseApiClient.getAssessmentOverviewSummary(token, agent, prisonNumber)
      expect(output).toEqual({ ...assessmentOverviewSummary, crd: null })
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

      const output = await assessForEarlyReleaseApiClient.getEligibilityCriteriaView(token, agent, prisonNumber)
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

      const output = await assessForEarlyReleaseApiClient.getEligibilityCriterionView(
        token,
        agent,
        prisonNumber,
        'code-1',
      )
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

      const output = await assessForEarlyReleaseApiClient.getSuitabilityCriterionView(
        token,
        agent,
        prisonNumber,
        'code-1',
      )
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

      await assessForEarlyReleaseApiClient.optOut(token, agent, prisonNumber, {
        reasonType: 'NOWHERE_TO_STAY',
        agent: {
          username: 'JohnDoe',
          fullName: 'John Doe',
          role: 'PRISON_CA',
          onBehalfOf: 'DOH',
        },
      })
      expect(fakeAferApi.isDone()).toBe(true)
    })
  })

  describe('Residential checks', () => {
    it('should get resident checks view', async () => {
      const residentialChecksView = createResidentialChecksView()

      const apiResponse = {
        ...residentialChecksView,
        assessmentSummary: {
          ...residentialChecksView.assessmentSummary,
          dateOfBirth: toIsoDate(residentialChecksView.assessmentSummary.dateOfBirth),
          hdced: toIsoDate(residentialChecksView.assessmentSummary.hdced),
          crd: toIsoDate(residentialChecksView.assessmentSummary.crd),
        },
      }

      const addressCheckRequestId = 1
      fakeAferApi
        .get(
          `/offender/${residentialChecksView.assessmentSummary.prisonNumber}/current-assessment/address-request/${addressCheckRequestId}/residential-checks`,
        )
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, apiResponse)

      const response = await assessForEarlyReleaseApiClient.getResidentialChecksView(
        token,
        agent,
        residentialChecksView.assessmentSummary.prisonNumber,
        addressCheckRequestId,
      )
      expect(fakeAferApi.isDone()).toBe(true)
      expect(response).toEqual(apiResponse)
    })

    it('should get residential checks task', async () => {
      const taskView = createResidentialChecksTaskView()
      const { prisonNumber } = taskView.assessmentSummary
      const taskCode = taskView.taskConfig.code
      const addressCheckRequestId = 1
      const apiResponse: _ResidentialChecksTaskView = {
        ...taskView,
        assessmentSummary: {
          ...taskView.assessmentSummary,
          dateOfBirth: toIsoDate(taskView.assessmentSummary.dateOfBirth),
          hdced: toIsoDate(taskView.assessmentSummary.hdced),
          crd: toIsoDate(taskView.assessmentSummary.crd),
        },
      }

      fakeAferApi
        .get(
          `/offender/${prisonNumber}/current-assessment/address-request/${addressCheckRequestId}/residential-checks/tasks/${taskCode}`,
        )
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, apiResponse)

      const response = await assessForEarlyReleaseApiClient.getResidentialChecksTask(
        token,
        agent,
        prisonNumber,
        addressCheckRequestId,
        taskCode,
      )
      expect(fakeAferApi.isDone()).toBe(true)
      expect(response).toEqual(taskView)
    })

    it('should save residential checks task answers', async () => {
      const taskView = createResidentialChecksTaskView()
      const { prisonNumber } = taskView.assessmentSummary
      const addressCheckRequestId = 1
      const saveAnswersRequest: SaveResidentialChecksTaskAnswersRequest = {
        taskCode: 'assess-this-persons-risk',
        answers: {
          'question-1': 'an answer',
          'question-2': 'Yes',
        },
        agent: {
          username: 'JohnDoe',
          fullName: 'John Doe',
          role: 'PROBATION_COM',
          onBehalfOf: 'N55LAU',
        },
      }

      fakeAferApi
        .post(
          `/offender/${prisonNumber}/current-assessment/address-request/${addressCheckRequestId}/residential-checks/answers`,
        )
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(201)

      await assessForEarlyReleaseApiClient.saveResidentialChecksTaskAnswers(
        token,
        agent,
        prisonNumber,
        addressCheckRequestId,
        saveAnswersRequest,
      )
      expect(fakeAferApi.isDone()).toBe(true)
    })
  })

  describe('getDecisionMakerCaseload', () => {
    const offenderSummaryList = [createOffenderSummary({})]

    it('should return data from api', async () => {
      const prisonCode = 'MDI'
      const apiResponse: _OffenderSummary[] = offenderSummaryList.map(c => {
        return {
          ...c,
          hdced: toIsoDate(c.hdced),
          postponementDate: toIsoDate(c.postponementDate),
          taskOverdueOn: toIsoDate(c.taskOverdueOn),
        }
      })

      fakeAferApi
        .get(`/prison/${prisonCode}/decision-maker/caseload`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, apiResponse)

      const output = await assessForEarlyReleaseApiClient.getDecisionMakerCaseload(token, agent, prisonCode)
      expect(output).toEqual(offenderSummaryList)
    })
  })

  describe('getOffenderForm', () => {
    it('should return pdf', async () => {
      const prisonNumber = 'PN12345'
      const documentSubjectType = 'OFFENDER_ELIGIBLE_FORM'
      const pdfBuffer = Buffer.from('pdf')

      fakeAferApi
        .get(`/offender/${prisonNumber}/document/${documentSubjectType}`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200, pdfBuffer)

      const output = await assessForEarlyReleaseApiClient.getForm(token, agent, prisonNumber, documentSubjectType)
      expect(output).toEqual(pdfBuffer)
    })
  })

  describe('Submit assessment', () => {
    const { prisonNumber } = createAssessmentOverviewSummary({})

    it('submit assessment for pre-decision checks', async () => {
      fakeAferApi
        .put(`/offender/${prisonNumber}/current-assessment/submit-for-pre-decision-checks`)
        .matchHeader('authorization', `Bearer ${token}`)
        .reply(200)

      await assessForEarlyReleaseApiClient.submitAssessmentForPreDecisionChecks(token, agent, prisonNumber)
      expect(fakeAferApi.isDone()).toBe(true)
    })
  })
})
