import type { AssessmentSummary, OffenderSummary } from '../../@types/assessForEarlyReleaseApiClientTypes'
import AssessmentStatus from '../../enumeration/assessmentStatus'

const createOffenderSummary = ({
  prisonNumber = 'A1234AB',
  bookingId = 54321,
  forename = 'Jim',
  surname = 'Smith',
  hdced = '01 Aug 2022',
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
  hdced = '01 Aug 2022',
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
  hdced = '10 Oct 2024',
  crd = '10 Oct 2024',
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
