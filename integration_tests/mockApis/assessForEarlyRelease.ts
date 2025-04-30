import { getMatchingRequests, stubFor } from './wiremock'
import {
  _AssessmentResponse,
  _AssessmentSearchResponse,
  _AssessmentSummary,
  _OffenderResponse,
  _OffenderSearchResponse,
  _OffenderSummary,
  AddressSummary,
  CheckRequestSummary,
  DeliusStaff,
  EligibilityCriterionProgress,
  PrisonUserDetails,
  SuitabilityCriterionProgress,
} from '../../server/@types/assessForEarlyReleaseApiClientTypes'
import { assessmentContactsResponse } from './assessForEarlyReleaseData'

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

const stubPrisonStaff = (staff: PrisonUserDetails) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/staff/prison/${staff.username}`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: staff,
    },
  })

const stubGetCaseAdminCaseload = (prisonCode: string, caseload: _OffenderSummary[]) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/prison/${prisonCode}/case-admin/caseload`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: caseload,
    },
  })

const stubGetComStaffCaseload = (staffCode: string, list: _OffenderSummary[]) =>
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

const stubGetComTeamCaseload = (staffCode: string, list: _OffenderSummary[]) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/probation/community-offender-manager/staff-code/${staffCode}/team-caseload`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: list,
    },
  })

const stubGetOffenderSearch = (searchString: string, list: _OffenderSearchResponse[]) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/support/offender/search/${searchString}`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: list,
    },
  })

const stubGetOffenderResponse = (prisonNumber: string, body: _OffenderResponse) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/support/offender/${prisonNumber}`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: body,
    },
  })

const stubGetAssessmentSearchResponse = (prisonNumber: string, list: _AssessmentSearchResponse[]) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/support/offender/${prisonNumber}/assessments`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: list,
    },
  })

const stubGetAssessmentResponse = (assessmentId: string, assessmentResponse: _AssessmentResponse) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/support/offender/assessment/${assessmentId}`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: assessmentResponse,
    },
  })

const stubDeleteAssessment = (assessmentId: string) =>
  stubFor({
    request: {
      method: 'DELETE',
      urlPattern: `/afer-api/support/offender/assessment/${assessmentId}`,
    },
    response: {
      status: 204,
    },
  })

const stubGetAssessmentContacts = (prisonNumber: string, contactResponse = assessmentContactsResponse([])) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/offender/${prisonNumber}/current-assessment/contacts`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: contactResponse,
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
  eligibilityStatus = 'NOT_STARTED',
  failureType: 'INELIGIBLE' | 'UNSUITABLE' = null,
  failedCheckReasons = [],
  suitabilityStatus = 'NOT_STARTED',
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
        eligibilityStatus,
        suitabilityStatus,
        eligibility,
        suitability,
        failureType,
        failedCheckReasons,
      },
    },
  })

const stubSaveCriterionAnswers = (
  assessmentSummary: _AssessmentSummary,
  eligibility: EligibilityCriterionProgress[],
  suitability: SuitabilityCriterionProgress[],
  overallStatus = 'NOT_STARTED',
  eligibilityStatus = 'NOT_STARTED',
  failureType: 'INELIGIBLE' | 'UNSUITABLE' = null,
  failedCheckReasons = [],
) =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/afer-api/offender/${assessmentSummary.prisonNumber}/current-assessment/eligibility-and-suitability-check`,
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
        eligibilityStatus,
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
      status: 204,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    },
  })

const stubOptIn = (prisonNumber: string) =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/afer-api/offender/${prisonNumber}/current-assessment/opt-in`,
    },
    response: {
      status: 204,
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
    return requests.map((request: { body: string }) => JSON.parse(request.body))
  })

const stubSearchForAddresses = (searchQuery: string, addressSummaries: AddressSummary[]) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/addresses/search/${searchQuery}`,
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
        residents: [],
      },
    },
  })

const stubGetStandardAddressCheckRequestWithResidents = (
  prisonNumber: string,
  requestId: number,
  isOffender: boolean,
) =>
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
        residents: [
          {
            residentId: 1,
            forename: 'Tommy',
            surname: 'Johnson',
            phoneNumber: '07527341960',
            relation: 'mother',
            dateOfBirth: '1985-03-31',
            age: 38,
            isMainResident: true,
            isOffender,
          },
          {
            residentId: 2,
            forename: 'Andy',
            surname: 'James',
            phoneNumber: '07527341987',
            relation: 'Brother',
            dateOfBirth: '1985-03-31',
            age: 58,
            isMainResident: false,
            isOffender: false,
          },
          {
            residentId: 3,
            forename: 'Tom',
            surname: 'Cook',
            phoneNumber: '07527341998',
            relation: '',
            dateOfBirth: '1985-03-31',
            age: 28,
            isMainResident: false,
            isOffender: false,
          },
        ],
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
      jsonBody: [
        {
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
      ],
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
              {
                name: 'COMPLETE_14_DAY_CHECKS',
                progress: 'LOCKED',
              },
              {
                name: 'COMPLETE_2_DAY_CHECKS',
                progress: 'LOCKED',
              },
              {
                name: 'PRINT_LICENCE',
                progress: 'LOCKED',
              },
            ],
          },
        },
        overallStatus: 'NOT_STARTED',
        tasks: [
          {
            config: {
              code: 'address-details-and-informed-consent',
              name: 'Address details and informed consent',
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
                        name: 'electricitySupply',
                        type: 'RADIO',
                        options: [
                          {
                            text: 'Yes',
                            value: 'true',
                          },
                          {
                            text: 'No',
                            value: 'false',
                          },
                        ],
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
                        name: 'visitedAddress',
                        type: 'RADIO',
                        options: [
                          {
                            text: 'I have visited this address and spoken to the main occupier',
                            value: 'I_HAVE_VISITED_THIS_ADDRESS_AND_SPOKEN_TO_THE_MAIN_OCCUPIER',
                          },
                          {
                            text: 'I have not visited the address but I have spoken to the main occupier',
                            value: 'I_HAVE_NOT_VISITED_THE_ADDRESS_BUT_I_HAVE_SPOKEN_TO_THE_MAIN_OCCUPIER',
                          },
                        ],
                      },
                    },
                    {
                      code: 'main-occupier-given-consent',
                      text: 'Has the main occupier given informed consent for {offenderForename} to be released here?',
                      hintText:
                        '<p>They must understand</p>\n<ul class="govuk-list govuk-list--bullet">\n  <li>what HDC involves</li>\n  <li>the offences {offenderForename} committed</li>\n</ul>',
                      input: {
                        name: 'mainOccupierConsentGiven',
                        type: 'RADIO',
                        options: [
                          {
                            text: 'Yes',
                            value: 'true',
                          },
                          {
                            text: 'No',
                            value: 'false',
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
            status: 'NOT_STARTED',
            answers: {
              visitedAddress: 'I_HAVE_NOT_VISITED_THE_ADDRESS_BUT_I_HAVE_SPOKEN_TO_THE_MAIN_OCCUPIER',
              electricitySupply: true,
              mainOccupierConsentGiven: false,
            },
          },
          {
            config: {
              code: 'police-check',
              name: 'Police checks',
              sections: [
                {
                  header: 'Police checks',
                  hintText:
                    'You must request and consider information from the police about the domestic abuse and\nchild wellbeing risks of releasing this person to the proposed address.',
                  questions: [
                    {
                      code: 'date-police-information-requested',
                      text: 'Enter the date that you requested this information',
                      hintText: 'For example, 31 3 1980',
                      input: {
                        name: 'informationRequested',
                        type: 'DATE',
                        options: null,
                      },
                    },
                    {
                      code: 'date-police-sent-information',
                      text: 'Enter the date that the police sent this information',
                      hintText: 'For example, 31 3 1980',
                      input: {
                        name: 'informationSent',
                        type: 'DATE',
                        options: null,
                      },
                    },
                    {
                      code: 'policeInformationSummary',
                      text: 'Summarise the information the police provided',
                      hintText: null,
                      input: {
                        name: 'informationSummary',
                        type: 'TEXT',
                        options: null,
                      },
                    },
                  ],
                },
              ],
            },
            status: 'NOT_STARTED',
            answers: {},
          },
          {
            config: {
              code: 'children-services-check',
              name: "Children's services check",
              sections: [
                {
                  header: "Children's services checks",
                  hintText:
                    "You must request and consider information from children's services about the domestic abuse and\nchild wellbeing risks of releasing this person to the proposed address.",
                  questions: [
                    {
                      code: 'date-children-services-information-requested',
                      text: 'Enter the date that you requested this information',
                      hintText: 'For example, 31 3 1980',
                      input: {
                        name: 'informationRequested',
                        type: 'DATE',
                        options: null,
                      },
                    },
                    {
                      code: 'date-children-services-information-sent',
                      text: "Enter the date that children's services sent this information",
                      hintText: 'For example, 31 3 1980',
                      input: {
                        name: 'informationSent',
                        type: 'DATE',
                        options: null,
                      },
                    },
                    {
                      code: 'children-services-information-summary',
                      text: "Summarise the information children's services provided",
                      hintText: null,
                      input: {
                        name: 'informationSummary',
                        type: 'TEXT',
                        options: null,
                      },
                    },
                  ],
                },
              ],
            },
            status: 'NOT_STARTED',
            answers: {},
          },
          {
            config: {
              code: 'assess-this-persons-risk',
              name: "Assess this person's risk",
              sections: [
                {
                  header: 'Risk management information',
                  hintText: null,
                  questions: [
                    {
                      code: 'pom-prison-behaviour-information',
                      text: 'What information has the POM provided about the behaviour of {offenderForename} while in prison?',
                      hintText:
                        'Find out if there are any concerns about them being released on HDC or if there have been any changes to their level of risk.',
                      input: {
                        name: 'pomPrisonBehaviourInformation',
                        type: 'TEXT',
                        options: null,
                      },
                    },
                    {
                      code: 'mental-health-treatment-needs',
                      text: 'Does {offenderForename} need any mental health treatment to help manage risk?',
                      hintText: 'If so, it should be considered as part of your risk management planning actions.',
                      input: {
                        name: 'mentalHealthTreatmentNeeds',
                        type: 'RADIO',
                        options: [
                          {
                            text: 'Yes',
                            value: 'true',
                          },
                          {
                            text: 'No',
                            value: 'false',
                          },
                        ],
                      },
                    },
                    {
                      code: 'is-there-a-vlo-officer-for-case',
                      text: 'Is there a victim liaison officer (VLO) for this case?',
                      hintText: null,
                      input: {
                        name: 'vloOfficerForCase',
                        type: 'RADIO',
                        options: [
                          {
                            text: 'Yes',
                            value: 'true',
                          },
                          {
                            text: 'No',
                            value: 'false',
                          },
                        ],
                      },
                    },
                    {
                      code: 'information-that-cannot-be-disclosed-to-offender',
                      text: 'Is there any information that cannot be disclosed to {offenderForename}?',
                      hintText: null,
                      input: {
                        name: 'informationThatCannotBeDisclosed',
                        type: 'RADIO',
                        options: [
                          {
                            text: 'Yes',
                            value: 'true',
                          },
                          {
                            text: 'No',
                            value: 'false',
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
            status: 'NOT_STARTED',
            answers: {},
          },
          {
            config: {
              code: 'suitability-decision',
              name: 'Suitability decision',
              sections: [
                {
                  header: null,
                  hintText: null,
                  questions: [
                    {
                      code: '69b608d0-35e1-44ea-9982-84d1cf6c0045',
                      text: 'Is this address suitable for {offenderForename} to be released to?',
                      hintText: null,
                      input: {
                        name: 'addressSuitable',
                        type: 'RADIO',
                        options: [
                          {
                            text: 'Yes',
                            value: 'true',
                          },
                          {
                            text: 'No',
                            value: 'false',
                          },
                        ],
                      },
                    },
                    {
                      code: 'e7ac8d33-fc04-4660-9d0e-bf121acf703f',
                      text: 'Add information to support your decision',
                      hintText: null,
                      input: {
                        name: 'addressSuitableInformation',
                        type: 'TEXT',
                        options: null,
                      },
                    },
                    {
                      code: '084edb2b-a52b-4723-b425-0069719fd5f9',
                      text: 'Do you need to add any more information about {offenderForename} or the proposed address for the monitoring contractor?',
                      hintText: null,
                      input: {
                        name: 'additionalInformationNeeded',
                        type: 'RADIO',
                        options: [
                          {
                            text: 'Yes',
                            value: 'true',
                          },
                          {
                            text: 'No',
                            value: 'false',
                          },
                        ],
                      },
                    },
                    {
                      code: 'cf8ffa01-6c3e-4710-875b-cff5b14e5c95',
                      text: 'Add more information',
                      hintText: null,
                      input: {
                        name: 'moreInformation',
                        type: 'TEXT',
                        options: null,
                      },
                    },
                  ],
                },
              ],
            },
            status: 'NOT_STARTED',
            answers: {},
          },
          {
            config: {
              code: 'make-a-risk-management-decision',
              name: 'Make a risk management decision',
              sections: [
                {
                  header: null,
                  hintText: null,
                  questions: [
                    {
                      code: 'can-offender-be-managed-safely',
                      text: 'Can {offenderForename} be managed safely in the community if they are released to the proposed address or CAS area?',
                      hintText: null,
                      input: {
                        name: 'canOffenderBeManagedSafely',
                        type: 'RADIO',
                        options: [
                          {
                            text: 'Yes',
                            value: 'true',
                          },
                          {
                            text: 'No',
                            value: 'false',
                          },
                        ],
                      },
                    },
                    {
                      code: 'information-to-support-decision',
                      text: 'Add information to support your decision',
                      hintText: null,
                      input: {
                        name: 'informationToSupportDecision',
                        type: 'TEXT',
                        options: null,
                      },
                    },
                    {
                      code: 'any-risk-management-planning-actions-needed',
                      text: 'Are any risk management planning actions needed prior to release before the address or CAS area can be suitable?',
                      hintText: null,
                      input: {
                        name: 'riskManagementPlanningActionsNeeded',
                        type: 'RADIO',
                        options: [
                          {
                            text: 'Yes',
                            value: 'true',
                          },
                          {
                            text: 'No',
                            value: 'false',
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
            status: 'NOT_STARTED',
            answers: {},
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
              { name: 'COMPLETE_14_DAY_CHECKS', progress: 'LOCKED' },
              { name: 'COMPLETE_2_DAY_CHECKS', progress: 'LOCKED' },
              {
                name: 'PRINT_LICENCE',
                progress: 'LOCKED',
              },
            ],
          },
        },
        taskConfig: {
          code: 'address-details-and-informed-consent',
          name: 'Address details and informed consent',
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
        answers: {},
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

const stubSaveVloAndPomInfo = (prisonNumber: string) =>
  stubFor({
    request: {
      method: 'PUT',
      urlPattern: `/afer-api/offender/${prisonNumber}/current-assessment/vlo-and-pom-consultation`,
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
  stubPrisonStaff,
  stubGetCaseAdminCaseload,
  stubGetComStaffCaseload,
  stubGetComTeamCaseload,
  stubGetAssessmentSummary,
  stubGetAssessmentContacts,
  stubGetEligibilityAndSuitability,
  stubGetEligibilityCriterionView,
  stubGetSuitabilityCriterionView,
  stubSaveCriterionAnswers,
  stubSubmitCheckRequest,
  stubOptOut,
  stubOptIn,
  getSubmittedEligibilityChecks,
  stubSearchForAddresses,
  stubAddStandardAddressCheckRequest,
  stubGetStandardAddressCheckRequest,
  stubGetStandardAddressCheckRequestWithResidents,
  stubAddResident,
  stubGetCheckRequestsForAssessment,
  stubGetResidentialChecksView,
  stubGetResidentialChecksTask,
  stubGetUpdateCaseAdminAdditionalInformation,
  stubGetOffenderSearch,
  stubGetOffenderResponse,
  stubGetAssessmentSearchResponse,
  stubDeleteAssessment,
  stubGetAssessmentResponse,
  stubSaveVloAndPomInfo,
}
