import type { OffenderSummary } from '../../@types/assessForEarlyReleaseApiClientTypes'

const createOffenderSummary = ({
  prisonerNumber = 'A1234AB',
  bookingId = 54321,
  firstName = 'Jim',
  lastName = 'Smith',
  hdced = '2022-08-01',
} = {}): OffenderSummary => ({
  prisonerNumber,
  bookingId,
  firstName,
  lastName,
  hdced,
})

const caseAdminCaseload = ({
  name = 'Jim Smith',
  prisonerNumber = 'A1234AB',
  hdced = '2022-08-01',
  remainingDays = 31,
} = {}) => ({
  name,
  prisonerNumber,
  hdced,
  remainingDays,
})

export { createOffenderSummary, caseAdminCaseload }
