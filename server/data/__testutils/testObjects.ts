import { addDays, startOfDay } from 'date-fns'
import type {
  AssessmentSummary,
  InitialChecks,
  OffenderSummary,
} from '../../@types/assessForEarlyReleaseApiClientTypes'
import AssessmentStatus from '../../enumeration/assessmentStatus'
import { Case } from '../../services/caseAdminCaseloadService'
import { parseIsoDate } from '../../utils/utils'

const createCase = ({
  prisonNumber = 'A1234AB',
  name = 'Jim Smith',
  hdced = parseIsoDate('2022-01-08'),
  remainingDays = 1,
} = {}): Case => ({
  prisonNumber,
  hdced,
  name,
  remainingDays,
})

const createOffenderSummary = ({
  prisonNumber = 'A1234AB',
  bookingId = 54321,
  forename = 'Jim',
  surname = 'Smith',
  hdced = addDays(startOfDay(new Date()), 3),
} = {}): OffenderSummary => ({
  prisonNumber,
  bookingId,
  forename,
  surname,
  hdced,
})

const createAssessmentSummary = ({
  forename = 'Jim',
  surname = 'Smith',
  prisonNumber = 'A1234AB',
  hdced = parseIsoDate('2022-10-08'),
  crd = parseIsoDate('2022-01-08'),
  location = 'Prison',
  status = AssessmentStatus.NOT_STARTED,
  policyVersion = '1.0',
} = {}): AssessmentSummary => ({
  forename,
  surname,
  prisonNumber,
  hdced,
  crd,
  location,
  status,
  policyVersion,
})

const createInitialChecks = ({
  forename = 'Jim',
  surname = 'Smith',
  prisonNumber = 'A1234AB',
  hdced = parseIsoDate('2022-08-01'),
  crd = parseIsoDate('2022-08-10'),
  location = 'Prison',
  status = AssessmentStatus.NOT_STARTED,
  policyVersion = '1.0',
} = {}): InitialChecks => ({
  assessmentSummary: {
    forename,
    surname,
    prisonNumber,
    hdced,
    crd,
    location,
    status,
    policyVersion,
  },
  checksPassed: false,
  complete: false,
  eligibilityStatus: 'NOT_STARTED',
  suitabilityStatus: 'NOT_STARTED',
  eligibility: [],
  suitability: [],
})

export { createCase, createOffenderSummary, createInitialChecks, createAssessmentSummary }
