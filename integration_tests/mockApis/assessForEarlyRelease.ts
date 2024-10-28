import { stubFor, getMatchingRequests } from './wiremock'
import {
  EligibilityCriterionProgress,
  SuitabilityCriterionProgress,
  _AssessmentSummary,
  AddressSummary,
  CheckRequestSummary,
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
  overallStatus = 'NOT_STARTED',
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
        overallStatus,
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

const stubGetAddressesForPostcode = (postcode: string, addressSummaries: AddressSummary[]) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/addresses\\?postcode=${postcode}`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: addressSummaries,
    },
  })

const stubAddStandardAddressCheckRequest = (prisonNumber: string) =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/afer-api/offender/${prisonNumber}/current-assessment/standard-address-check-request`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        requestId: 1,
        dateRequested: '2024-10-09',
        preferencePriority: 'FIRST',
        status: 'IN_PROGRESS',
        address: {
          uprn: '310010433',
          firstLine: '97, HARTLAND ROAD',
          secondLine: '',
          town: 'READING',
          county: 'READING',
          postcode: 'RG2 8AF',
          country: 'England',
          xCoordinate: 472219,
          yCoordinate: 170067,
          addressLastUpdated: '2020-06-25',
        },
      },
    },
  })

const stubGetStandardAddressCheckRequest = (prisonNumber: string, requestId: number) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/offender/${prisonNumber}/current-assessment/standard-address-check-request/${requestId}`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        requestId: 1,
        dateRequested: '2024-10-09',
        preferencePriority: 'FIRST',
        status: 'IN_PROGRESS',
        address: {
          uprn: '310010433',
          firstLine: '97, HARTLAND ROAD',
          secondLine: '',
          town: 'READING',
          county: 'READING',
          postcode: 'RG2 8AF',
          country: 'England',
          xCoordinate: 472219,
          yCoordinate: 170067,
          addressLastUpdated: '2020-06-25',
        },
      },
    },
  })

const stubAddResident = (prisonNumber: string, requestId: number) =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/afer-api/offender/${prisonNumber}/current-assessment/standard-address-check-request/${requestId}/resident`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        residentId: 1,
        forename: 'Josie',
        surname: 'Roberts',
        relation: 'mother',
        age: 97,
        isMainResident: true,
        standardAddressCheckRequest: {
          requestId: 1,
          dateRequested: '2024-10-09',
          preferencePriority: 'FIRST',
          status: 'IN_PROGRESS',
          address: {
            uprn: '310010433',
            firstLine: '97, HARTLAND ROAD',
            secondLine: '',
            town: 'READING',
            county: 'READING',
            postcode: 'RG2 8AF',
            country: 'England',
            xCoordinate: 472219,
            yCoordinate: 170067,
            addressLastUpdated: '2020-06-25',
          },
        },
      },
    },
  })

const stubGetCheckRequestsForAssessment = (prisonNumber: string, addressSummary: CheckRequestSummary[]) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/offender/${prisonNumber}/current-assessment/address-check-requests`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: addressSummary,
    },
  })

export default {
  stubGetAssessmentSummary,
  stubGetEligibilityAndSuitability,
  stubGetEligibilityCriterionView,
  stubGetSuitabilityCriterionView,
  stubSubmitCheckRequest,
  stubOptOut,
  getSubmittedEligibilityChecks,
  stubGetAddressesForPostcode,
  stubAddStandardAddressCheckRequest,
  stubGetStandardAddressCheckRequest,
  stubAddStandardAddressCheckRequestResident: stubAddResident,
  stubGetCheckRequestsForAssessment,
}
