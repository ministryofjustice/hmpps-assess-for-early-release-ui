import { addDays, startOfDay } from 'date-fns'
import type {
  AssessmentSummary,
  EligibilityCheck,
  InitialChecks,
  OffenderSummary,
  SuitabilityCheck,
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
  dateOfBirth = parseIsoDate('1976-04-14'),
  prisonNumber = 'A1234AB',
  hdced = parseIsoDate('2022-10-08'),
  crd = parseIsoDate('2022-01-08'),
  location = 'Prison',
  status = AssessmentStatus.NOT_STARTED,
  policyVersion = '1.0',
} = {}): AssessmentSummary => ({
  forename,
  surname,
  dateOfBirth,
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
  dateOfBirth = parseIsoDate('1976-04-14'),
  prisonNumber = 'A1234AB',
  hdced = parseIsoDate('2022-08-01'),
  crd = parseIsoDate('2022-08-10'),
  location = 'Prison',
  status = AssessmentStatus.NOT_STARTED,
  policyVersion = '1.0',
  eligibility = [] as EligibilityCheck[],
  suitability = [] as SuitabilityCheck[],
} = {}): InitialChecks => ({
  assessmentSummary: {
    forename,
    surname,
    dateOfBirth,
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
  eligibility,
  suitability,
})

const createQuestion = ({ name = 'question1', text = 'answer the question?', answer = null, hint = null }) => ({
  name,
  text,
  answer,
  hint,
})

const createEligbilityCheck = ({
  code = 'code-1',
  taskName = 'task-1',
  status = 'NOT_STARTED' as EligibilityCheck['status'],
  questions = [createQuestion({})],
}): EligibilityCheck => ({
  code,
  taskName,
  status,
  questions,
})

const createSuitabilityCheck = ({
  code = 'code-1',
  taskName = 'task-1',
  status = 'NOT_STARTED' as SuitabilityCheck['status'],
  questions = [createQuestion({})],
}): SuitabilityCheck => ({
  code,
  taskName,
  status,
  questions,
})

export {
  createCase,
  createOffenderSummary,
  createInitialChecks,
  createAssessmentSummary,
  createQuestion,
  createEligbilityCheck,
  createSuitabilityCheck,
}
