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
  stubOptOut,
}
