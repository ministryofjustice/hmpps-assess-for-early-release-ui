import { add } from 'date-fns'
import type {
  _AssessmentSummary,
  _OffenderSummary,
  CheckRequestSummary,
  EligibilityCriterionProgress,
  ResidentSummary,
  SuitabilityCriterionProgress,
  TaskCode,
} from '../../server/@types/assessForEarlyReleaseApiClientTypes'
import { tasks } from '../../server/config/tasks'
import AssessmentStatus from '../../server/enumeration/assessmentStatus'
import { toIsoDate } from '../../server/utils/utils'

export const eligibilityCriterion1: EligibilityCriterionProgress = {
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
  agent: null,
  lastUpdated: null,
}

export const eligibilityCriterion1Completed: EligibilityCriterionProgress = {
  code: 'code-1',
  taskName: 'Answer the first question',
  status: 'ELIGIBLE',
  questions: [
    {
      name: 'question1',
      text: 'Please answer question 1',
      answer: true,
      hint: 'Its simple really',
    },
  ],
  agent: {
    username: 'rDavidson',
    fullName: 'Rebecca Davidson',
    role: 'PRISON_CA',
    onBehalfOf: 'BMI',
  },
  lastUpdated: '2025-07-16',
}

export const eligibilityCriterion2: EligibilityCriterionProgress = {
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
      hint: 'its the last eligibility question!',
    },
  ],
}

export const eligibilityCriterion2Ineligible: EligibilityCriterionProgress = {
  code: 'code-2',
  taskName: 'Answer the second 2 questions',
  status: 'INELIGIBLE',
  questions: [
    {
      name: 'question2',
      text: 'Please answer question 2',
      answer: false,
      hint: null,
    },
    {
      name: 'question3',
      text: 'Please answer question 3',
      answer: false,
      hint: 'its the last eligibility question!',
    },
  ],
  agent: {
    username: 'rDavidson',
    fullName: 'Rebecca Davidson',
    role: 'PRISON_CA',
    onBehalfOf: 'BMI',
  },
  lastUpdated: '2025-07-15',
}

export const suitabilityCriterion1: SuitabilityCriterionProgress = {
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
}

export const assessmentSummary = (
  prisonNumber: string,
  status: AssessmentStatus = AssessmentStatus.NOT_STARTED,
): _AssessmentSummary => ({
  bookingId: 23987,
  forename: 'Jimmy',
  surname: 'Quelch',
  dateOfBirth: '1974-07-18',
  prisonNumber,
  hdced: toIsoDate(add(new Date(), { weeks: 1 })),
  crd: '2025-11-29',
  location: 'BMI',
  status,
  policyVersion: '1.0',
  mainOffense: 'Robbery',
  cellLocation: 'S-1-A1',
  tasks: {
    PRISON_CA: [
      { name: 'ASSESS_ELIGIBILITY', progress: 'READY_TO_START' },
      { name: 'ENTER_CURFEW_ADDRESS', progress: 'LOCKED' },
      { name: 'REVIEW_APPLICATION_AND_SEND_FOR_DECISION', progress: 'LOCKED' },
      { name: 'COMPLETE_14_DAY_CHECKS', progress: 'LOCKED' },
      { name: 'PRINT_LICENCE', progress: 'LOCKED' },
    ],
    PROBATION_COM: tasks.PROBATION_COM.map((task, i) => ({
      name: task.code as TaskCode,
      progress: i === 0 ? 'READY_TO_START' : 'LOCKED',
    })),
  },
})

const address1 = {
  firstLine: '97, HARTLAND ROAD',
  secondLine: '',
  town: 'READING',
  postcode: 'RG2 8AF',
  uprn: '310030567',
  county: 'READING',
  country: 'England',
  xcoordinate: 472231.0,
  ycoordinate: 170070.0,
  addressLastUpdated: new Date('2020-06-25'),
}

const address2 = {
  firstLine: '99, HARTLAND ROAD',
  secondLine: '',
  town: 'READING',
  postcode: 'RG2 8AF',
  uprn: '310030567',
  county: 'READING',
  country: 'England',
  xcoordinate: 472231.0,
  ycoordinate: 170070.0,
  addressLastUpdated: new Date('2020-06-25'),
}

const createResidentSummary = (residentId: number, isMainResident: boolean): ResidentSummary => ({
  residentId,
  forename: `Tommy`,
  surname: `Johnson-${residentId}`,
  phoneNumber: '07527341960',
  relation: 'mother',
  dateOfBirth: new Date('1985-03-31'),
  age: 38,
  isMainResident,
  isOffender: false,
})

export const createCheckRequestsForAssessmentSummary: CheckRequestSummary[] = [
  {
    requestType: 'STANDARD_ADDRESS',
    requestId: '1',
    caAdditionalInfo: null,
    ppAdditionalInfo: null,
    dateRequested: new Date('2024-11-05'),
    preferencePriority: 'FIRST',
    status: 'IN_PROGRESS',
    address: address1,
    residents: [createResidentSummary(1, true)],
  },
  {
    requestType: 'STANDARD_ADDRESS',
    requestId: '2',
    caAdditionalInfo: null,
    ppAdditionalInfo: null,
    dateRequested: new Date('2024-11-05'),
    preferencePriority: 'SECOND',
    status: 'IN_PROGRESS',
    address: address2,
    residents: [createResidentSummary(2, false)],
  },
]

export const createOffenderSummary = ({
  prisonNumber = '',
  forename = 'Jim',
  surname = 'Smith',
  hdced = '2022-01-08',
  workingDaysToHdced = 10,
  probationPractitioner = 'Mark Coombes',
  isPostponed = false,
  postponementDate = null,
  postponementReasons = [],
  status = AssessmentStatus.ELIGIBILITY_AND_SUITABILITY_IN_PROGRESS,
  addressChecksComplete = false,
} = {}): _OffenderSummary => ({
  prisonNumber,
  bookingId: 1,
  forename,
  surname,
  hdced,
  workingDaysToHdced,
  probationPractitioner,
  isPostponed,
  postponementDate,
  postponementReasons,
  status,
  addressChecksComplete,
})
