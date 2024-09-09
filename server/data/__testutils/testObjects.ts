import type { OffenderSummary } from '../../@types/assessForEarlyReleaseApiClientTypes'

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
  prisonNumber = 'A1234AB',
  hdced = '2022-08-01',
  remainingDays = 31,
} = {}) => ({
  name,
  prisonNumber,
  hdced,
  remainingDays,
})

export { createOffenderSummary, caseAdminCaseload }
