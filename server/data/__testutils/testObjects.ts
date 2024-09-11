import type { AssessmentSummary, OffenderSummary } from '../../@types/assessForEarlyReleaseApiClientTypes'
import AssessmentStatus from '../../enumeration/assessmentStatus'

const createOffenderSummary = ({
  prisonNumber = 'A1234AB',
  bookingId = 54321,
  forename = 'Jim',
  surname = 'Smith',
  hdced = '2022-08-01',
} = {}): OffenderSummary => ({
  prisonNumber,
  bookingId,
  forename,
  surname,
  hdced,
})

const caseAdminCaseload = ({
  name = 'Jim Smith',
  createLink = '/prison/assessment/A1234AB',
  prisonNumber = 'A1234AB',
  hdced = '2022-08-01',
  remainingDays = 31,
} = {}) => ({
  name,
  createLink,
  prisonNumber,
  hdced,
  remainingDays,
})

const createAssessmentSummary = ({
  forename = 'Jim',
  surname = 'Smith',
  prisonNumber = 'A1234AB',
  hdced = '2022-08-01',
  crd = '2022-10-01',
  location = 'Prison',
  status = AssessmentStatus.NOT_STARTED,
} = {}): AssessmentSummary => ({
  forename,
  surname,
  prisonNumber,
  hdced,
  crd,
  location,
  status,
})

export { createOffenderSummary, caseAdminCaseload, createAssessmentSummary }
