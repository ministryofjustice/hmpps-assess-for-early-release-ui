import {
  EligibilityCriterionProgress,
  SuitabilityCriterionProgress,
  _AssessmentSummary,
} from '../../server/@types/assessForEarlyReleaseApiClientTypes'
import AssessmentStatus from '../../server/enumeration/assessmentStatus'

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
      hint: 'its the last eligbility question!',
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
      hint: 'its the last eligbility question!',
    },
  ],
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
  forename: 'Jimmy',
  surname: 'Quelch',
  dateOfBirth: '1974-07-18',
  prisonNumber,
  hdced: '2025-08-12',
  crd: '2025-11-29',
  location: 'BMI',
  status,
  policyVersion: '1.0',
  tasks: [
    { name: 'ASSESS_ELIGIBILITY', progress: 'READY_TO_START' },
    { name: 'ENTER_CURFEW_ADDRESS', progress: 'LOCKED' },
    { name: 'REVIEW_APPLICATION_AND_SEND_FOR_DECISION', progress: 'LOCKED' },
    { name: 'PREPARE_FOR_RELEASE', progress: 'LOCKED' },
    { name: 'PRINT_LICENCE', progress: 'LOCKED' },
  ],
})
