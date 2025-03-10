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
  PrisonUserDetails,
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
  workingDaysToHdced = 1,
  probationPractitioner = 'Jane Huggins',
  isPostponed = false,
  status = AssessmentStatus.ELIGIBILITY_AND_SUITABILITY_IN_PROGRESS,
  taskOverdueOn = parseIsoDate('2022-01-08'),
  currentTask = 'ASSESS_ELIGIBILITY',
} = {}): Case => ({
  prisonNumber,
  hdced,
  workingDaysToHdced,
  name,
  probationPractitioner,
  isPostponed,
  status,
  addressChecksComplete: false,
  taskOverdueOn,
  currentTask,
})

const createOffenderSummary = ({
  prisonNumber = 'A1234AB',
  bookingId = 54321,
  forename = 'Jim',
  surname = 'Smith',
  hdced = addDays(startOfDay(new Date()), 3),
  probationPractitioner = 'CVl_COM',
  isPostponed = false,
  postponementDate = null,
  postponementReasons = [],
  workingDaysToHdced = 3,
  status = AssessmentStatus.NOT_STARTED,
  taskOverdueOn = parseIsoDate('2022-01-08'),
} = {}): OffenderSummary => ({
  prisonNumber,
  bookingId,
  forename,
  surname,
  hdced,
  workingDaysToHdced,
  probationPractitioner,
  isPostponed,
  postponementDate,
  postponementReasons,
  status,
  addressChecksComplete: false,
  taskOverdueOn,
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
  mainOffense = 'Robbery',
  cellLocation = 'S-1-A1',
  policyVersion = '1.0',
  responsibleCom = {
    staffCode: 'N55A023',
    username: 'afer_com',
    email: 'afer_com@digital.justice.gov.uk',
    forename: 'a',
    surname: 'com',
    team: 'N55LAU',
  },
} = {}): AssessmentSummary => ({
  forename,
  surname,
  dateOfBirth,
  prisonNumber,
  hdced,
  crd,
  location,
  status,
  responsibleCom,
  policyVersion,
  mainOffense,
  cellLocation,
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
  mainOffense = 'Robbery',
  cellLocation = 'S-2-A1',
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
    mainOffense,
    cellLocation,
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
  mainOffense = 'Robbery',
  cellLocation = 'S-2-A1',
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
    mainOffense,
    cellLocation,
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
  mainOffense = 'Robbery',
  cellLocation = 'S-2-A1',
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
    mainOffense,
    cellLocation,
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
  residents = [createResidentSummary()],
} = {}): StandardAddressCheckRequestSummary => ({
  requestId,
  caAdditionalInfo,
  ppAdditionalInfo,
  dateRequested,
  preferencePriority,
  status,
  address,
  residents,
  requestType: 'STANDARD_ADDRESS',
})

const createAddResidentRequest = ({
  forename = 'Tommy',
  surname = 'Johnson',
  phoneNumber = '07527341960',
  relation = 'mother',
  dateOfBirth = '1985-03-31',
  age = 38,
  isMainResident = true,
  isOffender = false,
} = {}): AddResidentRequest => ({
  forename,
  surname,
  phoneNumber,
  relation,
  dateOfBirth,
  age,
  isMainResident,
  isOffender,
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
  isOffender = false,
} = {}): ResidentSummary => ({
  residentId,
  forename,
  surname,
  phoneNumber,
  relation,
  dateOfBirth,
  age,
  isMainResident,
  isOffender,
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

const createPrisonStaffDetails = ({
  staffId = 1234,
  username = 'USER1',
  firstName = 'prison',
  lastName = 'staff',
  activeCaseLoadId = 'MDI',
  accountStatus = 'ACTIVE',
  active = true,
} = {}): PrisonUserDetails => ({
  staffId,
  username,
  firstName,
  lastName,
  activeCaseLoadId,
  accountStatus,
  active,
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
      config: {
        code: 'address-details-and-informed-consent',
        name: 'Address details and informed consent',
        sections: [
          {
            header: null,
            hintText: null,
            questions: [
              {
                code: 'connected-to-an-electricity-supply',
                text: 'Is the address connected to an electricity supply?',
                hintText: null,
                input: {
                  name: 'electricitySupply',
                  type: 'RADIO',
                  options: [
                    { text: 'Yes', value: 'true' },
                    { text: 'No', value: 'false' },
                  ],
                },
              },
            ],
          },
          {
            header: 'Informed consent',
            hintText: null,
            questions: [
              {
                code: 'have-you-visited-this-address-in-person',
                text: 'Have you visited this address in person?',
                hintText: 'It is not mandatory to do so.',
                input: {
                  name: 'visitedAddress',
                  type: 'RADIO',
                  options: [
                    {
                      text: 'I have visited this address and spoken to the main occupier',
                      value: 'I_HAVE_VISITED_THIS_ADDRESS_AND_SPOKEN_TO_THE_MAIN_OCCUPIER',
                    },
                    {
                      text: 'I have not visited the address but I have spoken to the main occupier',
                      value: 'I_HAVE_NOT_VISITED_THE_ADDRESS_BUT_I_HAVE_SPOKEN_TO_THE_MAIN_OCCUPIER',
                    },
                  ],
                },
              },
              {
                code: 'main-occupier-given-consent',
                text: 'Has the main occupier given informed consent for {offenderForename} to be released here?',
                hintText:
                  '<p>They must understand</p>\n<ul class="govuk-list govuk-list--bullet">\n  <li>what HDC involves</li>\n  <li>the offences {offenderForename} committed</li>\n</ul>',
                input: {
                  name: 'mainOccupierConsentGiven',
                  type: 'RADIO',
                  options: [
                    { text: 'Yes', value: 'true' },
                    { text: 'No', value: 'false' },
                  ],
                },
              },
            ],
          },
        ],
      },
      status: 'NOT_STARTED',
      answers: {
        visitedAddress: 'I_HAVE_NOT_VISITED_THE_ADDRESS_BUT_I_HAVE_SPOKEN_TO_THE_MAIN_OCCUPIER',
        electricitySupply: false,
        mainOccupierConsentGiven: false,
      },
    },
    {
      config: {
        code: 'police-check',
        name: 'Police check',
        sections: [],
      },
      status: 'NOT_STARTED',
      answers: {},
    },
    {
      config: {
        code: 'children-services-check',
        name: "Children's services check",
        sections: [],
      },
      status: 'NOT_STARTED',
      answers: {},
    },
    {
      config: {
        code: 'assess-this-persons-risk',
        name: "Assess this person's risk",
        sections: [],
      },
      status: 'NOT_STARTED',
      answers: {},
    },
    {
      config: {
        code: 'suitability-decision',
        name: 'Suitability decision',
        sections: [],
      },
      status: 'NOT_STARTED',
      answers: {},
    },
    {
      config: {
        code: 'make-a-risk-management-decision',
        name: 'Make a risk management decision',
        sections: [],
      },
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
          {
            code: 'is-there-a-vlo-officer-for-case',
            text: 'Is there a victim liaison officer (VLO) for this case?',
            hintText: null,
            input: {
              name: 'vlo-officer-for-case',
              type: 'RADIO',
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
          {
            code: 'information-that-cannot-be-disclosed-to-offender',
            text: 'Is there any information that cannot be disclosed to {offenderForename}?',
            hintText: null,
            input: {
              name: 'information-that-cannot-be-disclosed',
              type: 'RADIO',
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
  mainOffense = 'Robbery',
  cellLocation = 'S-2-A1',
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
    mainOffense,
    cellLocation,
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
  mainOffense = 'Robbery',
  cellLocation = 'S-2-A1',
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
    mainOffense,
    cellLocation,
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

const createAgent = ({
  username = 'user1',
  fullName = 'User One',
  role = 'PRISON_CA',
  onBehalfOf = 'N55LAU',
} = {}) => ({
  username,
  fullName,
  role,
  onBehalfOf,
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
  createPrisonStaffDetails,
  createResidentialChecksView,
  createResidentialChecksTaskView,
  createComCase,
  createAgent,
}
