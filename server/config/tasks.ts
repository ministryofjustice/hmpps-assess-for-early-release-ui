import { AssessmentSummary } from '../@types/assessForEarlyReleaseApiClientTypes'
import paths from '../routes/paths'

export type Task = {
  code: string
  title: string
  lockedDescription?: (assessment: AssessmentSummary) => string
  path?: (assessment: AssessmentSummary) => string
}

export const tasks: Task[] = [
  {
    code: 'ASSESS_ELIGIBILITY',
    title: 'Assess eligibility and suitability',
    path: paths.prison.assessment.initialChecks.tasklist,
  },
  {
    code: 'ENTER_CURFEW_ADDRESS',
    title: 'Enter curfew addresses or CAS areas',
    lockedDescription: assessment =>
      `You can start this task if ${assessment.forename} is eligible and suitable for HDC.`,
    path: paths.prison.assessment.optOutCheck,
  },
  {
    code: 'REVIEW_APPLICATION_AND_SEND_FOR_DECISION',
    title: 'Review application and send for decision',
    lockedDescription: assessment =>
      `You can complete this task if a probation practitioner finds a suitable address and agrees ${assessment.forename} can be released on HDC.`,
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
]
