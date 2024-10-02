import { stubFor, getMatchingRequests } from './wiremock'
import {
  EligibilityCriterionProgress,
  SuitabilityCriterionProgress,
  _AssessmentSummary,
} from '../../server/@types/assessForEarlyReleaseApiClientTypes'

const stubGetAssessmentSummary = (assessmentSummary: _AssessmentSummary) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/offender/${assessmentSummary.prisonNumber}/current-assessment`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: assessmentSummary,
    },
  })

const stubGetEligibilityAndSuitability = (
  assessmentSummary: _AssessmentSummary,
  eligibility: EligibilityCriterionProgress[],
  suitability: SuitabilityCriterionProgress[],
) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/offender/${assessmentSummary.prisonNumber}/current-assessment/eligibility-and-suitability`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        assessmentSummary,
        checksPassed: false,
        complete: false,
        eligibilityStatus: 'NOT_STARTED',
        suitabilityStatus: 'NOT_STARTED',
        eligibility,
        suitability,
      },
    },
  })

const stubSubmitCheckRequest = (prisonNumber: string) =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/afer-api/offender/${prisonNumber}/current-assessment/eligibility-and-suitability-check`,
    },
    response: {
      status: 204,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  })

const stubGetEligibilityCriterionView = (
  assessmentSummary: _AssessmentSummary,
  criterion: EligibilityCriterionProgress,
  nextCriterion: EligibilityCriterionProgress,
) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/offender/${assessmentSummary.prisonNumber}/current-assessment/eligibility/${criterion.code}`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        assessmentSummary,
        criterion,
        nextCriterion,
      },
    },
  })

const stubGetSuitabilityCriterionView = (
  assessmentSummary: _AssessmentSummary,
  criterion: SuitabilityCriterionProgress,
  nextCriterion: SuitabilityCriterionProgress,
) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/offender/${assessmentSummary.prisonNumber}/current-assessment/suitability/${criterion.code}`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        assessmentSummary,
        criterion,
        nextCriterion,
      },
    },
  })

const stubOptOut = (prisonNumber: string) =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/afer-api/offender/${prisonNumber}/current-assessment/opt-out`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  })

const getSubmittedEligibilityChecks = (assessmentSummary: _AssessmentSummary) =>
  getMatchingRequests({
    method: 'PUT',
    urlPath: `/afer-api/offender/${assessmentSummary.prisonNumber}/current-assessment/eligibility-and-suitability-check`,
  }).then(data => {
    const { requests } = data.body
    if (!requests.length) {
      throw new Error('No matching requests')
    }
    return requests.map(request => JSON.parse(request.body))
  })

export default {
  stubGetAssessmentSummary,
  stubGetEligibilityAndSuitability,
  stubGetEligibilityCriterionView,
  stubGetSuitabilityCriterionView,
  stubSubmitCheckRequest,
  stubOptOut,
  getSubmittedEligibilityChecks,
}
