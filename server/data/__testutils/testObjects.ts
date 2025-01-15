import { addDays, startOfDay } from 'date-fns'
import {
  AddResidentRequest,
  AddressSummary,
  AddStandardAddressCheckRequest,
  AssessmentSummary,
  CheckRequestSummary,
  DeliusStaff,
  EligibilityAndSuitabilityCaseView,
  EligibilityCriterionProgress,
  EligibilityCriterionView,
  OffenderSummary,
  ResidentialChecksTask,
  ResidentialChecksTaskProgress,
  ResidentialChecksTaskView,
  ResidentialChecksView,
  ResidentialCheckTaskStatus,
  ResidentSummary,
  StandardAddressCheckRequestSummary,
  SuitabilityCriterionProgress,
  SuitabilityCriterionView,
  TaskCode,
} from '../../@types/assessForEarlyReleaseApiClientTypes'
import AssessmentStatus from '../../enumeration/assessmentStatus'
import type { Case } from '../../services/caseAdminCaseloadService'
import type { Case as ComCase } from '../../services/communityOffenderManagerCaseloadService'
import { parseIsoDate } from '../../utils/utils'
import { tasks } from '../../config/tasks'

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
  probationPractitioner = 'CVl_COM',
} = {}): OffenderSummary => ({
  prisonNumber,
  bookingId,
  forename,
  surname,
  hdced,
  probationPractitioner,
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
  tasks: {
    PRISON_CA: tasks.PRISON_CA.map((task, i) => ({
      name: task.code as TaskCode,
      progress: i === 0 ? 'READY_TO_START' : 'LOCKED',
    })),
    PROBATION_COM: tasks.PROBATION_COM.map((task, i) => ({
      name: task.code as TaskCode,
      progress: i === 0 ? 'READY_TO_START' : 'LOCKED',
    })),
  },
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
    tasks: {
      PRISON_CA: [
        { name: 'ASSESS_ELIGIBILITY', progress: 'READY_TO_START' },
        { name: 'ENTER_CURFEW_ADDRESS', progress: 'LOCKED' },
        { name: 'REVIEW_APPLICATION_AND_SEND_FOR_DECISION', progress: 'LOCKED' },
        { name: 'PREPARE_FOR_RELEASE', progress: 'LOCKED' },
        { name: 'PRINT_LICENCE', progress: 'LOCKED' },
      ],
    },
  },
  overallStatus: 'NOT_STARTED',
  eligibilityStatus: 'NOT_STARTED',
  suitabilityStatus: 'NOT_STARTED',
  eligibility,
  suitability,
  failureType: null,
  failedCheckReasons: [],
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
    tasks: {
      PRISON_CA: [
        { name: 'ASSESS_ELIGIBILITY', progress: 'READY_TO_START' },
        { name: 'ENTER_CURFEW_ADDRESS', progress: 'LOCKED' },
        { name: 'REVIEW_APPLICATION_AND_SEND_FOR_DECISION', progress: 'LOCKED' },
        { name: 'PREPARE_FOR_RELEASE', progress: 'LOCKED' },
        { name: 'PRINT_LICENCE', progress: 'LOCKED' },
      ],
    },
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
    tasks: {
      PRISON_CA: [
        { name: 'ASSESS_ELIGIBILITY', progress: 'READY_TO_START' },
        { name: 'ENTER_CURFEW_ADDRESS', progress: 'LOCKED' },
        { name: 'REVIEW_APPLICATION_AND_SEND_FOR_DECISION', progress: 'LOCKED' },
        { name: 'PREPARE_FOR_RELEASE', progress: 'LOCKED' },
        { name: 'PRINT_LICENCE', progress: 'LOCKED' },
      ],
    },
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

const createAddressSummary = ({
  uprn = '310030567',
  firstLine = '99, HARTLAND ROAD',
  secondLine = '',
  town = 'READING',
  county = 'READING',
  postcode = 'RG2 8AF',
  country = 'England',
  xcoordinate = 472231.0,
  ycoordinate = 170070.0,
  addressLastUpdated = new Date('2020-06-25'),
}): AddressSummary => ({
  uprn,
  firstLine,
  secondLine,
  town,
  county,
  postcode,
  country,
  xcoordinate,
  ycoordinate,
  addressLastUpdated,
})

const createAddStandardAddressCheckRequest = ({
  ppAdditionalInfo = '',
  caAdditionalInfo = '',
  preferencePriority = 'FIRST' as AddStandardAddressCheckRequest['preferencePriority'],
  addressUprn = '310030567',
}): AddStandardAddressCheckRequest => ({
  caAdditionalInfo,
  ppAdditionalInfo,
  preferencePriority,
  addressUprn,
})

const createStandardAddressCheckRequestSummary = ({
  requestId = 1,
  caAdditionalInfo = '',
  ppAdditionalInfo = '',
  dateRequested = new Date('2024-11-05'),
  preferencePriority = 'FIRST' as StandardAddressCheckRequestSummary['preferencePriority'],
  status = 'IN_PROGRESS' as StandardAddressCheckRequestSummary['status'],
  address = createAddressSummary({}),
} = {}): StandardAddressCheckRequestSummary => ({
  requestId,
  caAdditionalInfo,
  ppAdditionalInfo,
  dateRequested,
  preferencePriority,
  status,
  address,
})

const createAddResidentRequest = ({
  forename = 'Tommy',
  surname = 'Johnson',
  phoneNumber = '07527341960',
  relation = 'mother',
  dateOfBirth = '1985-03-31',
  age = 38,
  isMainResident = true,
} = {}): AddResidentRequest => ({
  forename,
  surname,
  phoneNumber,
  relation,
  dateOfBirth,
  age,
  isMainResident,
})

const createResidentSummary = ({
  residentId = 4,
  forename = 'Tommy',
  surname = 'Johnson',
  phoneNumber = '07527341960',
  relation = 'mother',
  dateOfBirth = parseIsoDate('1985-03-31'),
  age = 38,
  isMainResident = true,
} = {}): ResidentSummary => ({
  residentId,
  forename,
  surname,
  phoneNumber,
  relation,
  dateOfBirth,
  age,
  isMainResident,
})

const createCheckRequestsForAssessmentSummary = ({
  requestType = 'STANDARD_ADDRESS',
  requestId = '1',
  caAdditionalInfo = '',
  ppAdditionalInfo = '',
  dateRequested = new Date('2024-11-05'),
  preferencePriority = 'FIRST',
  status = 'IN_PROGRESS',
  address = {
    firstLine: '99, HARTLAND ROAD',
    secondLine: '',
    town: 'READING',
    postcode: 'RG2 8AF',
  },
  residents = [createResidentSummary()],
} = {}): CheckRequestSummary[] => [
  {
    requestType,
    requestId,
    caAdditionalInfo,
    ppAdditionalInfo,
    dateRequested,
    preferencePriority,
    status,
    address,
    residents,
  },
]

const createStaffDetails = ({
  id = 2000,
  code = 'STAFF1',
  email = 'jbloggs@probation.gov.uk',
  teams = [
    {
      code: 'teamCode-1',
      description: 'lauCode',
    },
    {
      code: 'teamCode-2',
      description: 'lauCode',
    },
    {
      code: 'teamCode-3',
      description: 'lauCode',
    },
    {
      code: 'teamCode-4',
      description: 'lauCode',
    },
  ],
} = {}): DeliusStaff => ({
  id,
  code,
  email,
  teams,
})

const createComCase = ({
  name = 'Jim Smith',
  probationPractitioner = 'CVl_COM',
  prisonNumber = 'A1234AB',
  hdced = parseIsoDate('2022-01-08'),
  workingDaysToHdced = 1,
} = {}): ComCase => ({
  hdced,
  probationPractitioner,
  prisonNumber,
  name,
  workingDaysToHdced,
})

const createChecksTasks = (): ResidentialChecksTaskProgress[] => {
  return [
    {
      code: 'address-details-and-informed-consent',
      taskName: 'Address details and informed consent',
      status: 'NOT_STARTED',
      answers: {},
    },
    {
      code: 'police-check',
      taskName: 'Police check',
      status: 'NOT_STARTED',
      answers: {},
    },
    {
      code: 'children-services-check',
      taskName: "Children's services check",
      status: 'NOT_STARTED',
      answers: {},
    },
    {
      code: 'assess-this-persons-risk',
      taskName: "Assess this person's risk",
      status: 'NOT_STARTED',
      answers: {},
    },
    {
      code: 'suitability-decision',
      taskName: 'Suitability decision',
      status: 'NOT_STARTED',
      answers: {},
    },
    {
      code: 'make-a-risk-management-decision',
      taskName: 'Make a risk management decision',
      status: 'NOT_STARTED',
      answers: {},
    },
  ]
}

const createResidentialChecksTask = (): ResidentialChecksTask => {
  return {
    code: 'assess-this-persons-risk',
    name: "Assess this person's risk",
    sections: [
      {
        header: 'Risk management information',
        hintText: null,
        questions: [
          {
            code: 'pom-prison-behaviour-information',
            text: 'What information has the POM provided about the behaviour of {offenderForename} while in prison?',
            hintText:
              'Find out if there are any concerns about them being released on HDC or if there have been any changes to their level of risk.',
            input: {
              name: 'pom-prison-behaviour-information',
              type: 'TEXT',
              dataType: 'STRING',
              options: null,
            },
          },
          {
            code: 'mental-health-treatment-needs',
            text: 'Does {offenderForename} need any mental health treatment to help manage risk?',
            hintText: 'If so, it should be considered as part of your risk management planning actions.',
            input: {
              name: 'mental-health-treatment-needs',
              type: 'RADIO',
              dataType: 'BOOLEAN',
              options: [
                {
                  text: 'Yes',
                  value: 'Yes',
                },
                {
                  text: 'No',
                  value: 'No',
                },
              ],
            },
          },
          {
            code: 'is-there-a-vlo-officer-for-case',
            text: 'Is there a victim liaison officer (VLO) for this case?',
            hintText: null,
            input: {
              name: 'vlo-officer-for-case',
              type: 'RADIO',
              dataType: 'BOOLEAN',
              options: [
                {
                  text: 'Yes',
                  value: 'Yes',
                },
                {
                  text: 'No',
                  value: 'Yes',
                },
              ],
            },
          },
          {
            code: 'information-that-cannot-be-disclosed-to-offender',
            text: 'Is there any information that cannot be disclosed to {offenderForename}?',
            hintText: null,
            input: {
              name: 'information-that-cannot-be-disclosed',
              type: 'RADIO',
              dataType: 'BOOLEAN',
              options: [
                {
                  text: 'Yes',
                  value: 'true',
                },
                {
                  text: 'No',
                  value: 'false',
                },
              ],
            },
          },
        ],
      },
    ],
  }
}

const createResidentialChecksView = ({
  forename = 'Jim',
  surname = 'Smith',
  dateOfBirth = parseIsoDate('1976-04-14'),
  prisonNumber = 'A1234AB',
  hdced = parseIsoDate('2022-08-01'),
  crd = parseIsoDate('2022-08-10'),
  location = 'Prison',
  status = AssessmentStatus.NOT_STARTED,
  policyVersion = '1.0',
  overallStatus = 'NOT_STARTED' as ResidentialCheckTaskStatus,
  residentialChecksTasks = createChecksTasks(),
} = {}): ResidentialChecksView => ({
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
    tasks: {
      PRISON_CA: [
        { name: 'ASSESS_ELIGIBILITY', progress: 'READY_TO_START' },
        { name: 'ENTER_CURFEW_ADDRESS', progress: 'LOCKED' },
        { name: 'REVIEW_APPLICATION_AND_SEND_FOR_DECISION', progress: 'LOCKED' },
        { name: 'PREPARE_FOR_RELEASE', progress: 'LOCKED' },
        { name: 'PRINT_LICENCE', progress: 'LOCKED' },
      ],
    },
  },
  overallStatus,
  tasks: residentialChecksTasks,
})

const createResidentialChecksTaskView = ({
  forename = 'Jim',
  surname = 'Smith',
  dateOfBirth = parseIsoDate('1976-04-14'),
  prisonNumber = 'A1234AB',
  hdced = parseIsoDate('2022-08-01'),
  crd = parseIsoDate('2022-08-10'),
  location = 'Prison',
  status = AssessmentStatus.NOT_STARTED,
  policyVersion = '1.0',
} = {}): ResidentialChecksTaskView => ({
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
    tasks: {
      PRISON_CA: [
        { name: 'ASSESS_ELIGIBILITY', progress: 'READY_TO_START' },
        { name: 'ENTER_CURFEW_ADDRESS', progress: 'LOCKED' },
        { name: 'REVIEW_APPLICATION_AND_SEND_FOR_DECISION', progress: 'LOCKED' },
        { name: 'PREPARE_FOR_RELEASE', progress: 'LOCKED' },
        { name: 'PRINT_LICENCE', progress: 'LOCKED' },
      ],
    },
  },
  taskConfig: createResidentialChecksTask(),
  taskStatus: 'NOT_STARTED',
  answers: {},
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
  createAddressSummary,
  createAddStandardAddressCheckRequest,
  createStandardAddressCheckRequestSummary,
  createAddResidentRequest,
  createResidentSummary,
  createCheckRequestsForAssessmentSummary,
  createStaffDetails,
  createResidentialChecksView,
  createResidentialChecksTaskView,
  createComCase,
}
