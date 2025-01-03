import { stubFor, getMatchingRequests } from './wiremock'
import {
  EligibilityCriterionProgress,
  SuitabilityCriterionProgress,
  _AssessmentSummary,
  AddressSummary,
  CheckRequestSummary,
  _OffenderSummary,
  DeliusStaff,
} from '../../server/@types/assessForEarlyReleaseApiClientTypes'

const stubDeliusStaff = (username: string, staff: DeliusStaff) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/staff\\?username=${username}`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: staff,
    },
  })

const stubGetComCaseload = (staffCode: string, list: _OffenderSummary[]) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/probation/community-offender-manager/staff-code/${staffCode}/caseload`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: list,
    },
  })

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
  failureType = null,
  failedCheckReasons = [],
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
        failureType,
        failedCheckReasons,
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

const stubGetResidentialChecksView = (prisonNumber: string, addressCheckRequestId: number) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/offender/${prisonNumber}/current-assessment/address-request/${addressCheckRequestId}/residential-checks`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        assessmentSummary: {
          forename: 'dave',
          surname: 'smith',
          dateOfBirth: '2024-09-18',
          prisonNumber,
          hdced: '2024-09-20',
          crd: null,
          location: 'Moorland (HMP & YOI)',
          status: 'AWAITING_ADDRESS_AND_RISK_CHECKS',
          policyVersion: '1.0',
          tasks: {
            PRISON_CA: [
              {
                name: 'ASSESS_ELIGIBILITY',
                progress: 'COMPLETE',
              },
              {
                name: 'ENTER_CURFEW_ADDRESS',
                progress: 'COMPLETE',
              },
              {
                name: 'REVIEW_APPLICATION_AND_SEND_FOR_DECISION',
                progress: 'LOCKED',
              },
              {
                name: 'PREPARE_FOR_RELEASE',
                progress: 'LOCKED',
              },
              {
                name: 'PRINT_LICENCE',
                progress: 'LOCKED',
              },
            ],
            PROBATION_COM: [
              {
                name: 'CHECK_ADDRESSES_OR_COMMUNITY_ACCOMMODATION',
                progress: 'READY_TO_START',
              },
              {
                name: 'MAKE_A_RISK_MANAGEMENT_DECISION',
                progress: 'LOCKED',
              },
              {
                name: 'SEND_CHECKS_TO_PRISON',
                progress: 'LOCKED',
              },
              {
                name: 'CREATE_LICENCE',
                progress: 'LOCKED',
              },
            ],
          },
        },
        overallStatus: 'NOT_STARTED',
        tasks: [
          {
            code: 'address-details-and-informed-consent',
            taskName: 'Address details and informed consent',
            status: 'NOT_STARTED',
          },
          {
            code: 'police-check',
            taskName: 'Police check',
            status: 'NOT_STARTED',
          },
          {
            code: 'children-services-check',
            taskName: "Children's services check",
            status: 'NOT_STARTED',
          },
          {
            code: 'assess-this-persons-risk',
            taskName: "Assess this person's risk",
            status: 'NOT_STARTED',
          },
          {
            code: 'suitability-decision',
            taskName: 'Suitability decision',
            status: 'NOT_STARTED',
          },
          {
            code: 'make-a-risk-management-decision',
            taskName: 'Make a risk management decision',
            status: 'NOT_STARTED',
          },
        ],
      },
    },
  })

const stubGetResidentialChecksTask = (prisonNumber: string, addressCheckRequestId: number) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/offender/${prisonNumber}/current-assessment/address-request/${addressCheckRequestId}/residential-checks/tasks/address-details-and-informed-consent`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        assessmentSummary: {
          forename: 'FIRST-1',
          surname: 'LAST-1',
          dateOfBirth: '1978-03-20',
          prisonNumber: 'A1234AA',
          hdced: '2020-10-25',
          crd: '2020-11-14',
          location: 'Birmingham (HMP)',
          status: 'ELIGIBLE_AND_SUITABLE',
          policyVersion: '1.0',
          tasks: {
            PRISON_CA: [
              {
                name: 'ASSESS_ELIGIBILITY',
                progress: 'COMPLETE',
              },
              {
                name: 'ENTER_CURFEW_ADDRESS',
                progress: 'READY_TO_START',
              },
              {
                name: 'REVIEW_APPLICATION_AND_SEND_FOR_DECISION',
                progress: 'LOCKED',
              },
              { name: 'PREPARE_FOR_RELEASE', progress: 'LOCKED' },
              {
                name: 'PRINT_LICENCE',
                progress: 'LOCKED',
              },
            ],
          },
        },
        taskConfig: {
          code: 'address-details-and-informed-consent',
          name: 'Check if a curfew address is suitable',
          sections: [
            {
              header: null,
              hintText: null,
              questions: [
                {
                  code: 'connected-to-an-electricity-supply',
                  text: 'Is the address connected to an electricity supply?',
                  hintText: null,
                  input: {
                    name: 'electricity-supply',
                    type: 'RADIO',
                    options: [{ value: 'Yes' }, { value: 'No' }],
                  },
                },
              ],
            },
            {
              header: 'Informed consent',
              hintText: null,
              questions: [
                {
                  code: 'have-you-visited-this-address-in-person',
                  text: 'Have you visited this address in person?',
                  hintText: 'It is not mandatory to do so.',
                  input: {
                    name: 'visited-address',
                    type: 'RADIO',
                    options: [
                      { value: 'I have visited this address and spoken to the main occupier' },
                      { value: 'I have not visited the address but I have spoken to the main occupier' },
                    ],
                  },
                },
                {
                  code: 'main-occupier-given-consent',
                  text: 'Has the main occupier given informed consent for {offenderForename} to be released here?',
                  hintText:
                    '<p>They must understand</p>\n<ul class="govuk-list govuk-list--bullet">\n  <li>what HDC involves</li>\n  <li>the offences {offenderForename} committed</li>\n</ul>',
                  input: {
                    name: 'main-occupier-consent',
                    type: 'RADIO',
                    options: [{ value: 'Yes' }, { value: 'No' }],
                  },
                },
              ],
            },
          ],
        },
        taskStatus: 'NOT_STARTED',
      },
    },
  })

const stubGetUpdateCaseAdminAdditionalInformation = (prisonNumber: string, requestId: number) =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/afer-api/offender/${prisonNumber}/current-assessment/address-request/${requestId}/case-admin-additional-information`,
    },
    response: {
      status: 204,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  })

export default {
  stubDeliusStaff,
  stubGetComCaseload,
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
  stubAddResident,
  stubGetCheckRequestsForAssessment,
  stubGetResidentialChecksView,
  stubGetResidentialChecksTask,
  stubGetUpdateCaseAdminAdditionalInformation,
}
