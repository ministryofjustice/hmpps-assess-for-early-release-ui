import { add } from 'date-fns'
import {
  _AssessmentResponse,
  _AssessmentSearchResponse,
  _AssessmentSummary,
  _OffenderResponse,
  _OffenderSearchResponse,
  _OffenderSummary,
  AssessmentContactsResponse,
  CheckRequestSummary,
  ComSummary,
  ContactResponse,
  EligibilityCriterionProgress,
  ResidentSummary,
  SuitabilityCriterionProgress,
  TaskCode,
} from '../../server/@types/assessForEarlyReleaseApiClientTypes'
import { tasks } from '../../server/config/tasks'
import AssessmentStatus from '../../server/enumeration/assessmentStatus'
import { toIsoDate } from '../../server/utils/utils'
import OptOutReasonType from '../../server/enumeration/optOutReasonType'

export const eligibilityCriterion1: EligibilityCriterionProgress = {
  code: 'code-1',
  taskName: 'Answer the first question',
  status: 'NOT_STARTED',
  questions: [
    {
      name: 'question1',
      failedQuestionDescription: 'failed because',
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
      failedQuestionDescription: 'failed because',
      text: 'Please answer question 1',
      answer: true,
      hint: 'Its simple really',
    },
  ],
  agent: {
    username: 'kKular',
    fullName: 'Kahlest Kular',
    role: 'PRISON_CA',
    onBehalfOf: 'BMI',
  },
  lastUpdated: '2025-07-16',
}

export const suitabilityCriterionComplete: SuitabilityCriterionProgress = {
  code: 'code-1',
  taskName: 'Answer the first suitability question',
  status: 'SUITABLE',
  questions: [
    {
      name: 'question1',
      failedQuestionDescription: 'failed because',
      text: 'Please answer question 1',
      answer: true,
      hint: 'Its simple really',
    },
  ],
  agent: {
    username: 'kKular',
    fullName: 'Kahlest Kular',
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
      failedQuestionDescription: 'failed because',
      text: 'Please answer question 2',
      answer: null,
      hint: null,
    },
    {
      name: 'question3',
      failedQuestionDescription: 'failed because',
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
      failedQuestionDescription: 'failed because',
      text: 'Please answer question 2',
      answer: false,
      hint: null,
    },
    {
      name: 'question3',
      failedQuestionDescription: 'failed because',
      text: 'Please answer question 3',
      answer: false,
      hint: 'its the last eligibility question!',
    },
  ],
  agent: {
    username: 'kKular',
    fullName: 'Kahlest Kular',
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
      failedQuestionDescription: 'failed because',
      text: 'Please answer question 4',
      answer: null,
      hint: 'Theres only one suitability question',
    },
  ],
}

export const assessmentSummary = (
  prisonNumber: string,
  status: AssessmentStatus = AssessmentStatus.NOT_STARTED,
  activeComTaskCode: string = 'CHECK_ADDRESSES_OR_COMMUNITY_ACCOMMODATION',
): _AssessmentSummary => ({
  bookingId: 23987,
  forename: 'Kurn',
  surname: 'Uvarek',
  dateOfBirth: '1974-07-18',
  prisonNumber,
  hdced: toIsoDate(add(new Date(), { weeks: 1 })),
  crd: '2025-11-29',
  location: 'BMI',
  status,
  policyVersion: '1.0',
  mainOffense: 'Robbery',
  cellLocation: 'S-1-A1',
  postponementReasons: [],
  tasks: {
    PRISON_CA: [
      { name: 'ASSESS_ELIGIBILITY', progress: 'READY_TO_START' },
      { name: 'ENTER_CURFEW_ADDRESS', progress: 'LOCKED' },
      { name: 'REVIEW_APPLICATION_AND_SEND_FOR_DECISION', progress: 'LOCKED' },
      { name: 'COMPLETE_14_DAY_CHECKS', progress: 'LOCKED' },
      { name: 'PRINT_LICENCE', progress: 'LOCKED' },
    ],
    PROBATION_COM: tasks.PROBATION_COM.map(task => ({
      name: task.code as TaskCode,
      progress: task.code === activeComTaskCode ? 'READY_TO_START' : 'LOCKED',
    })),
  },
})

export const assessmentContactsResponse = (contacts: ContactResponse[]): AssessmentContactsResponse => ({
  contacts,
})

export const contactResponse = (
  fullName: string,
  userRole: 'PRISON_CA' | 'PRISON_DM' | 'PROBATION_COM',
  email?: string,
  locationName?: string,
): ContactResponse => ({
  fullName,
  userRole,
  email,
  locationName,
})

const address1 = {
  firstLine: '1, TEST ROAD',
  secondLine: '',
  town: 'TEST TOWN',
  postcode: 'TEST',
  uprn: '310030567',
  county: 'TEST COUNTY',
  country: 'England',
  xcoordinate: 472231.0,
  ycoordinate: 170070.0,
  addressLastUpdated: new Date('2020-06-25'),
}

const address2 = {
  firstLine: '2, TEST ROAD',
  secondLine: '',
  town: 'TEST TOWN',
  postcode: 'TEST',
  uprn: '310030567',
  county: 'TEST COUNTY',
  country: 'England',
  xcoordinate: 472231.0,
  ycoordinate: 170070.0,
  addressLastUpdated: new Date('2020-06-25'),
}

const createResidentSummary = (residentId: number, isMainResident: boolean): ResidentSummary => ({
  residentId,
  forename: `Kola`,
  surname: `Anag-${residentId}`,
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
  crn = 'X123456',
  forename = 'Lestav',
  surname = 'Mogh',
  hdced = '2022-01-08',
  workingDaysToHdced = 10,
  probationPractitioner = 'Shena Elas',
  isPostponed = false,
  postponementDate = null,
  postponementReasons = [],
  status = AssessmentStatus.ELIGIBILITY_AND_SUITABILITY_IN_PROGRESS,
  addressChecksComplete = false,
  lastUpdateBy = 'Reli Boral',
} = {}): _OffenderSummary => ({
  prisonNumber,
  crn,
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
  lastUpdateBy,
})

export const refusedOffender = createOffenderSummary({
  prisonNumber: 'GU3243TP',
  forename: 'Kadar',
  surname: 'Vrag',
  hdced: '2026-09-04',
  workingDaysToHdced: 15,
  probationPractitioner: 'Kagran Darj',
  status: AssessmentStatus.REFUSED,
})

export const timedOutOffender = createOffenderSummary({
  prisonNumber: 'G3243TH',
  forename: 'Antaan',
  surname: 'Kruge',
  hdced: '2026-09-04',
  workingDaysToHdced: 15,
  status: AssessmentStatus.TIMED_OUT,
})

export const postponedOffender = createOffenderSummary({
  prisonNumber: 'G3243TH',
  crn: 'W493087',
  forename: 'Antaan',
  surname: 'Kruge',
  hdced: '2026-09-04',
  workingDaysToHdced: 15,
  isPostponed: true,
  postponementDate: '2025-04-25',
  postponementReasons: ['Postponed for some reason'],
  status: AssessmentStatus.POSTPONED,
})

export const assessmentCompletedOffender = createOffenderSummary({
  prisonNumber: 'K8932TE',
  crn: 'Z456712',
  forename: 'Kessum',
  surname: 'Laggal',
  hdced: '2026-10-25',
  workingDaysToHdced: 3,
  probationPractitioner: 'David Newton',
  status: AssessmentStatus.PASSED_PRE_RELEASE_CHECKS,
})

export const toWorkOnByComCases = createOffenderSummary({
  prisonNumber: 'G3243TB',
  forename: 'Keth',
  surname: 'Chang',
  hdced: '2026-12-06',
  workingDaysToHdced: 10,
  status: AssessmentStatus.AWAITING_ADDRESS_AND_RISK_CHECKS,
})

export const withDecisionMaker = createOffenderSummary({
  prisonNumber: 'G8303TB',
  forename: 'Simon',
  surname: 'Adamson',
  hdced: '2027-04-09',
  workingDaysToHdced: 27,
  probationPractitioner: 'Russell Dickson',
  status: AssessmentStatus.AWAITING_DECISION,
})

export const withPrisonOffender = createOffenderSummary({
  prisonNumber: 'G7543KR',
  crn: 'X921514',
  forename: 'Kev',
  surname: 'Nestar',
  hdced: '2026-02-25',
  workingDaysToHdced: 39,
  status: AssessmentStatus.ELIGIBILITY_AND_SUITABILITY_IN_PROGRESS,
})

export const createOffenderSearchResponse = ({
  prisonNumber = 'A1234AE',
  prisonId = 'BRI',
  forename = 'Lestav',
  surname = 'Mogh',
  dateOfBirth = '2001-01-08',
  crn = 'X123456',
} = {}): _OffenderSearchResponse => ({
  prisonNumber,
  prisonId,
  forename,
  surname,
  dateOfBirth,
  crn,
})

export const createOffenderResponse = ({
  prisonNumber = 'A1234AA',
  prisonId = 'BRS',
  forename = 'Nestar',
  surname = 'Mogh',
  dateOfBirth = '2002-02-20',
  crn = 'DX12340A',
  createdTimestamp = '2020-01-11T12:13:00',
  lastUpdatedTimestamp = '2020-02-12T12:13:00',
} = {}): _OffenderResponse => ({
  prisonNumber,
  prisonId,
  forename,
  surname,
  dateOfBirth,
  crn,
  createdTimestamp,
  lastUpdatedTimestamp,
})

export const createAssessmentSearchResponse = ({
  id = 722,
  bookingId = 773722,
  status = AssessmentStatus.ELIGIBLE_AND_SUITABLE,
  previousStatus = AssessmentStatus.NOT_STARTED,
  createdTimestamp = '2020-01-11T12:13:00',
  lastUpdatedTimestamp = '2020-01-12T12:13:00',
  deletedTimestamp = null,
} = {}): _AssessmentSearchResponse => ({
  id,
  bookingId,
  status,
  previousStatus,
  createdTimestamp,
  lastUpdatedTimestamp,
  deletedTimestamp,
})

export const createResponsibleCom = ({
  staffCode = 'STAFF1',
  username = 'testName',
  email = 'test.com@moj.com',
  forename = 'testForename',
  surname = 'testSurname',
} = {}): ComSummary => ({
  staffCode,
  username,
  email,
  forename,
  surname,
})

export const createAssessmentResponse = ({
  id = 722,
  bookingId = 773722,
  status = AssessmentStatus.NOT_STARTED,
  previousStatus = null,
  createdTimestamp = '2020-01-10T12:13:00',
  lastUpdatedTimestamp = '2020-01-11T12:13:00',
  deletedTimestamp = '2020-01-12T12:13:00',
  policyVersion = '1',
  addressChecksComplete = true,
  teamCode = 'MyTeam',
  responsibleCom = createResponsibleCom(),
  postponementDate = '2026-08-23',
  optOutReasonType = OptOutReasonType.NOWHERE_TO_STAY,
  optOutReasonOther = 'another reason',
  hdced = '2026-08-23',
  crd = '2026-09-23',
  sentenceStartDate = '2028-06-23',
} = {}): _AssessmentResponse => ({
  id,
  bookingId,
  status,
  previousStatus,
  createdTimestamp,
  lastUpdatedTimestamp,
  deletedTimestamp,
  policyVersion,
  addressChecksComplete,
  teamCode,
  postponementDate,
  optOutReasonType,
  optOutReasonOther,
  responsibleCom,
  hdced,
  crd,
  sentenceStartDate,
})
