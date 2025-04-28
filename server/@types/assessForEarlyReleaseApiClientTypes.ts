import { components, operations } from './assessForEarlyReleaseApiImport'

type ParsingDates<T, Fields> = {
  [K in keyof T]: K extends Fields ? Date : T[K] extends object ? ParsingDates<T[K], Fields> : T[K]
}

export type _OffenderSummary = components['schemas']['OffenderSummaryResponse']
export type OffenderSummary = ParsingDates<_OffenderSummary, 'hdced' | 'postponementDate' | 'taskOverdueOn'>

export type _OffenderSearchResponse = components['schemas']['OffenderSearchResponse']
export type OffenderSearchResponse = ParsingDates<_OffenderSearchResponse, 'dateOfBirth'>

export type _OffenderResponse = components['schemas']['OffenderResponse']
export type OffenderResponse = ParsingDates<
  _OffenderResponse,
  'dateOfBirth' | 'hdced' | 'crd' | 'sentenceStartDate' | 'createdTimestamp' | 'lastUpdatedTimestamp'
>

export type _AddressSummary = components['schemas']['AddressSummary']
export type AddressSummary = ParsingDates<_AddressSummary, 'addressLastUpdated'>

export type _AssessmentSummary = components['schemas']['AssessmentSummary']
export type AssessmentSummary = ParsingDates<_AssessmentSummary, 'dateOfBirth' | 'hdced' | 'crd'>

export type DocumentSubjectType = operations['getOffenderPdf']['parameters']['path']['documentSubjectType']

export type _EligibilityAndSuitabilityCaseView = components['schemas']['EligibilityAndSuitabilityCaseView']
export type EligibilityAndSuitabilityCaseView = ParsingDates<
  _EligibilityAndSuitabilityCaseView,
  'dateOfBirth' | 'hdced' | 'crd'
>

export type EligibilityCriterionProgress = components['schemas']['EligibilityCriterionProgress']
export type _EligibilityCriterionView = components['schemas']['EligibilityCriterionView']
export type EligibilityCriterionView = ParsingDates<_EligibilityCriterionView, 'dateOfBirth' | 'hdced' | 'crd'>

export type SuitabilityCriterionProgress = components['schemas']['SuitabilityCriterionProgress']
export type _SuitabilityCriterionView = components['schemas']['SuitabilityCriterionView']
export type SuitabilityCriterionView = ParsingDates<_SuitabilityCriterionView, 'dateOfBirth' | 'hdced' | 'crd'>

export type CriterionView = EligibilityCriterionView | SuitabilityCriterionView
export type CriterionProgress = SuitabilityCriterionProgress | EligibilityCriterionProgress

export type OptOutRequest = components['schemas']['OptOutRequest']

export type CriterionCheck = components['schemas']['CriterionCheck']

export type AddStandardAddressCheckRequest = components['schemas']['AddStandardAddressCheckRequest']
export type _StandardAddressCheckRequestSummary = components['schemas']['StandardAddressCheckRequestSummary']
export type StandardAddressCheckRequestSummary = ParsingDates<
  _StandardAddressCheckRequestSummary,
  'dateRequested' | 'addressLastUpdated'
>
export type _CheckRequestSummary = components['schemas']['CheckRequestSummary']
export type CheckRequestSummary = ParsingDates<_CheckRequestSummary, 'dateRequested' | 'addressLastUpdated'>
export type AddResidentRequest = components['schemas']['AddResidentRequest']
export type _ResidentSummary = components['schemas']['ResidentSummary']
export type ResidentSummary = ParsingDates<_ResidentSummary, 'dateOfBirth' | 'dateRequested' | 'addressLastUpdated'>

export type EligibilityStatus = components['schemas']['EligibilityAndSuitabilityCaseView']['eligibilityStatus']
export type SuitabilityStatus = components['schemas']['EligibilityAndSuitabilityCaseView']['suitabilityStatus']

export type DeliusStaff = components['schemas']['User']
export type PrisonUserDetails = components['schemas']['PrisonApiUserDetail']

export type UserRole = 'PRISON_CA' | 'PRISON_DM' | 'PROBATION_COM' | 'SUPPORT'
export type TaskCode = components['schemas']['TaskProgress']['name']

export type _ResidentialChecksView = components['schemas']['ResidentialChecksView']
export type ResidentialChecksView = ParsingDates<_ResidentialChecksView, 'dateOfBirth' | 'hdced' | 'crd'>
export type ResidentialChecksTaskProgress = components['schemas']['ResidentialChecksTaskProgress']
export type ResidentialCheckTaskStatus = components['schemas']['ResidentialChecksTaskProgress']['status']
export type _ResidentialChecksTaskView = components['schemas']['ResidentialChecksTaskView']
export type ResidentialChecksTaskView = ParsingDates<_ResidentialChecksTaskView, 'dateOfBirth' | 'hdced' | 'crd'>
export type ResidentialChecksTask = components['schemas']['Task']
export type SaveResidentialChecksTaskAnswersRequest = components['schemas']['SaveResidentialChecksTaskAnswersRequest']
export type ResidentialChecksTaskAnswersSummary = components['schemas']['ResidentialChecksTaskAnswersSummary']

export type UpdateCaseAdminAdditionInfoRequest = components['schemas']['UpdateCaseAdminAdditionInfoRequest']
export type MapStringAny = components['schemas']['MapStringAny']
export type ProblemDetail = components['schemas']['ProblemDetail']
export type Agent = components['schemas']['AgentDto']

export type _AssessmentOverviewSummary = components['schemas']['AssessmentOverviewSummary']
export type AssessmentOverviewSummary = ParsingDates<
  _AssessmentOverviewSummary,
  'dateOfBirth' | 'hdced' | 'crd' | 'toDoEligibilityAndSuitabilityBy'
>
export type AssessmentContactsResponse = components['schemas']['AssessmentContactsResponse']
export type ContactResponse = components['schemas']['ContactResponse']
export type _AssessmentResponse = components['schemas']['AssessmentResponse']
export type AssessmentResponse = ParsingDates<
  _AssessmentResponse,
  'createdTimestamp' | 'lastUpdatedTimestamp' | 'deletedTimestamp' | 'postponementDate'
>
export type ComSummary = components['schemas']['ComSummary']
export type _AssessmentSearchResponse = components['schemas']['AssessmentSearchResponse']
export type AssessmentSearchResponse = ParsingDates<
  _AssessmentSearchResponse,
  'createdTimestamp' | 'lastUpdatedTimestamp' | 'deletedTimestamp'
>

export type UpdateVloAndPomConsultationRequest = components['schemas']['UpdateVloAndPomConsultationRequest']
export type NonDisclosableInformation = components['schemas']['NonDisclosableInformation']
