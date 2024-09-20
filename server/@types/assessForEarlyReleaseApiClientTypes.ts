import { components } from './assessForEarlyReleaseApiImport'

type ParsingDates<T, Fields> = {
  [K in keyof T]: K extends Fields ? Date : T[K] extends object ? ParsingDates<T[K], Fields> : T[K]
}

export type _OffenderSummary = components['schemas']['OffenderSummary']
export type OffenderSummary = ParsingDates<_OffenderSummary, 'hdced'>

export type _AssessmentSummary = components['schemas']['AssessmentSummary']
export type AssessmentSummary = ParsingDates<_AssessmentSummary, 'dateOfBirth' | 'hdced' | 'crd'>

export type _InitialChecks = components['schemas']['InitialChecks']
export type InitialChecks = ParsingDates<_InitialChecks, 'dateOfBirth' | 'hdced' | 'crd'>
export type OptOutRequest = components['schemas']['OptOutRequest']
