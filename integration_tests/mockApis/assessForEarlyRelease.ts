import { stubFor } from './wiremock'
import AssessmentStatus from '../../server/enumeration/assessmentStatus'

const stubGetAssessmentSummary = (prisonNumber: string, status: AssessmentStatus = AssessmentStatus.NOT_STARTED) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/offender/${prisonNumber}/current-assessment`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        forename: 'Jimmy',
        surname: 'Quelch',
        dateOfBirth: '1974-07-18',
        prisonNumber,
        hdced: '2025-08-12',
        crd: '2025-11-29',
        location: 'BMI',
        status,
        policyVersion: '1.0',
      },
    },
  })

const stubGetInitialChecks = (prisonNumber: string, status: AssessmentStatus = AssessmentStatus.NOT_STARTED) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/afer-api/offender/${prisonNumber}/current-assessment/initial-checks`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        assessmentSummary: {
          forename: 'Jimmy',
          surname: 'Quelch',
          dateOfBirth: '1974-07-18',
          prisonNumber,
          hdced: '2025-08-12',
          crd: '2025-11-29',
          location: 'BMI',
          status,
          policyVersion: '1.0',
        },
        checksPassed: false,
        complete: false,
        eligibilityStatus: 'NOT_STARTED',
        suitabilityStatus: 'NOT_STARTED',
        eligibility: [
          {
            code: 'code-1',
            taskName: 'Answer the first question',
            status: 'NOT_STARTED',
            questions: [
              {
                name: 'question1',
                text: 'Please answer question 1',
                answer: null,
                hint: 'Its simple really',
              },
            ],
          },
          {
            code: 'code-2',
            taskName: 'Answer the second 2 questions',
            status: 'NOT_STARTED',
            questions: [
              {
                name: 'question2',
                text: 'Please answer question 2',
                answer: null,
                hint: null,
              },
              {
                name: 'question3',
                text: 'Please answer question 3',
                answer: null,
                hint: 'its the last eligbility question!',
              },
            ],
          },
        ],
        suitability: [
          {
            code: 'code-3',
            taskName: 'Answer the first suitability question',
            status: 'NOT_STARTED',
            questions: [
              {
                name: 'question3',
                text: 'Please answer question 4',
                answer: null,
                hint: 'Theres only one suitability question',
              },
            ],
          },
        ],
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

export default {
  stubGetAssessmentSummary,
  stubGetInitialChecks,
  stubOptOut,
}
