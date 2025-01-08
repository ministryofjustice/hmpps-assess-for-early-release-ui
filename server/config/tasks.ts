import { AssessmentSummary, UserRole } from '../@types/assessForEarlyReleaseApiClientTypes'
import paths from '../routes/paths'
import { properCase } from '../utils/utils'

export type Task = {
  code: string
  title: string
  lockedDescription?: (assessment: AssessmentSummary) => string
  path?: (assessment: AssessmentSummary) => string
}

type UsersWithTypes = Exclude<UserRole, 'SUPPORT'>

export const tasks: Record<UsersWithTypes, Task[]> = {
  PRISON_CA: [
    {
      code: 'ASSESS_ELIGIBILITY',
      title: 'Assess eligibility and suitability',
      path: paths.prison.assessment.initialChecks.tasklist,
    },
    {
      code: 'ENTER_CURFEW_ADDRESS',
      title: 'Enter curfew addresses or CAS areas',
      lockedDescription: assessment =>
        `You can start this task if ${properCase(assessment.forename)} is eligible and suitable for HDC.`,
      path: paths.prison.assessment.enterCurfewAddressOrCasArea.optOutCheck,
    },
    {
      code: 'REVIEW_APPLICATION_AND_SEND_FOR_DECISION',
      title: 'Review application and send for decision',
      lockedDescription: assessment =>
        `You can complete this task if a probation practitioner finds a suitable address and agrees ${properCase(assessment.forename)} can be released on HDC.`,
    },
    {
      code: 'PREPARE_FOR_RELEASE',
      title: 'Prepare for release',
      lockedDescription: () => 'You can complete this task once a decision maker has approved the HDC application.',
    },
    {
      code: 'PRINT_LICENCE',
      title: 'Print licence',
      lockedDescription: () =>
        'You can view information about a licence as soon as it has been started and print it once approved.',
    },
  ],
  PROBATION_COM: [
    {
      code: 'CHECK_ADDRESSES_OR_COMMUNITY_ACCOMMODATION',
      title: 'Check addresses or community accommodation',
      path: paths.probation.assessment.curfewAddress.checkCurfewAddresses,
    },
    {
      code: 'MAKE_A_RISK_MANAGEMENT_DECISION',
      title: 'Make a risk management decision',
      lockedDescription: assessment =>
        `You can start this task if ${properCase(assessment.forename)} is eligible and suitable for HDC.`,
      path: undefined,
    },
    {
      code: 'SEND_CHECKS_TO_PRISON',
      title: 'Send checks to prison',
      lockedDescription: () => `You can start this when you have completed address and risk checks.`,
    },
    {
      code: 'CREATE_LICENCE',
      title: 'Create Licence',
      lockedDescription: () => 'You can do this if a decision maker in prison approves George for HDC release.',
    },
  ],
  PRISON_DM: [
    {
      code: 'CONFIRM_RELEASE',
      title: 'Confirm release',
      path: undefined,
    },
    {
      code: 'APPROVE_LICENCE',
      title: 'Approve licence',
      path: undefined,
    },
    {
      code: 'OPT_IN',
      title: 'Opt in',
      path: undefined,
    },
  ],
}
