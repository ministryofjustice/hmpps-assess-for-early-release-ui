import { components } from './assessForEarlyReleaseApiImport'

type ParsingDates<T, Fields> = {
  [K in keyof T]: K extends Fields ? Date : T[K] extends object ? ParsingDates<T[K], Fields> : T[K]
}

export type _OffenderSummary = components['schemas']['OffenderSummary']
export type OffenderSummary = ParsingDates<_OffenderSummary, 'hdced'>

export type _AddressSummary = components['schemas']['AddressSummary']
export type AddressSummary = ParsingDates<_AddressSummary, 'addressLastUpdated'>

export type _AssessmentSummary = components['schemas']['AssessmentSummary']
export type AssessmentSummary = ParsingDates<_AssessmentSummary, 'dateOfBirth' | 'hdced' | 'crd'>

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

export type UserRole = 'PRISON_CA' | 'PRISON_DM' | 'PROBATION_COM' | 'SUPPORT'
export type TaskCode = components['schemas']['TaskProgress']['name']

export type ResidentialChecksView = components['schemas']['ResidentialChecksView']
export type ResidentialCheckTaskStatus = components['schemas']['ResidentialChecksTaskProgress']['status']
