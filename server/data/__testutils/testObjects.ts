import { addDays, startOfDay } from 'date-fns'
import type {
  AssessmentSummary,
  EligibilityCriterionProgress,
  EligibilityAndSuitabilityCaseView,
  OffenderSummary,
  SuitabilityCriterionProgress,
  EligibilityCriterionView,
  SuitabilityCriterionView,
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

const createEligibilityAndSuitabilityCaseView = ({
  forename = 'Jim',
  surname = 'Smith',
  dateOfBirth = parseIsoDate('1976-04-14'),
  prisonNumber = 'A1234AB',
  hdced = parseIsoDate('2022-08-01'),
  crd = parseIsoDate('2022-08-10'),
  location = 'Prison',
  status = AssessmentStatus.NOT_STARTED,
  policyVersion = '1.0',
  eligibility = [] as EligibilityCriterionProgress[],
  suitability = [] as SuitabilityCriterionProgress[],
} = {}): EligibilityAndSuitabilityCaseView => ({
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

const createEligibilityCriterionView = ({
  forename = 'Jim',
  surname = 'Smith',
  dateOfBirth = parseIsoDate('1976-04-14'),
  prisonNumber = 'A1234AB',
  hdced = parseIsoDate('2022-08-01'),
  crd = parseIsoDate('2022-08-10'),
  location = 'Prison',
  status = AssessmentStatus.NOT_STARTED,
  policyVersion = '1.0',
  criterion = createEligibilityCriterionProgress({ code: 'code-1' }),
  nextCriterion = createEligibilityCriterionProgress({ code: 'code-2' }),
} = {}): EligibilityCriterionView => ({
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
  criterion,
  nextCriterion,
})

const createSuitabilityCriterionView = ({
  forename = 'Jim',
  surname = 'Smith',
  dateOfBirth = parseIsoDate('1976-04-14'),
  prisonNumber = 'A1234AB',
  hdced = parseIsoDate('2022-08-01'),
  crd = parseIsoDate('2022-08-10'),
  location = 'Prison',
  status = AssessmentStatus.NOT_STARTED,
  policyVersion = '1.0',
  criterion = createSuitabilityCriterionProgress({ code: 'code-1' }),
  nextCriterion = createSuitabilityCriterionProgress({ code: 'code-2' }),
} = {}): SuitabilityCriterionView => ({
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
  criterion,
  nextCriterion,
})

const createQuestion = ({ name = 'question1', text = 'answer the question?', answer = null, hint = null }) => ({
  name,
  text,
  answer,
  hint,
})

const createEligibilityCriterionProgress = ({
  code = 'code-1',
  taskName = 'task-1',
  status = 'NOT_STARTED' as EligibilityCriterionProgress['status'],
  questions = [createQuestion({})],
}): EligibilityCriterionProgress => ({
  code,
  taskName,
  status,
  questions,
})

const createSuitabilityCriterionProgress = ({
  code = 'code-1',
  taskName = 'task-1',
  status = 'NOT_STARTED' as SuitabilityCriterionProgress['status'],
  questions = [createQuestion({})],
}): SuitabilityCriterionProgress => ({
  code,
  taskName,
  status,
  questions,
})

export {
  createCase,
  createOffenderSummary,
  createEligibilityAndSuitabilityCaseView,
  createEligibilityCriterionView,
  createSuitabilityCriterionView,
  createAssessmentSummary,
  createQuestion,
  createEligibilityCriterionProgress,
  createSuitabilityCriterionProgress,
}
