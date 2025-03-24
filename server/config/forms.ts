import paths from '../routes/paths'
import AssessmentStatus from '../enumeration/assessmentStatus'
import DocumentSubjectType from '../enumeration/documentSubjectType'

export type Form = {
  link: (prisonNumber: string) => string
  text: string
}

const commonForms: Form[] = [
  {
    link: prisonNumber => getLink(prisonNumber, DocumentSubjectType.OFFENDER_ELIGIBLE_FORM),
    text: 'Eligible',
  },
  {
    link: prisonNumber => getLink(prisonNumber, DocumentSubjectType.OFFENDER_ADDRESS_CHECKS_INFORMATION_FORM),
    text: 'Information about address checks',
  },
  {
    link: prisonNumber => getLink(prisonNumber, DocumentSubjectType.OFFENDER_ADDRESS_CHECKS_FORM),
    text: 'Address checks',
  },
  {
    link: prisonNumber => getLink(prisonNumber, DocumentSubjectType.OFFENDER_OPT_OUT_FORM),
    text: 'Opt out',
  },
]

export const getStatusFormsMap: { [key in AssessmentStatus]: Form[] } = {
  [AssessmentStatus.ELIGIBLE_AND_SUITABLE]: commonForms,
  [AssessmentStatus.INELIGIBLE_OR_UNSUITABLE]: [
    {
      link: prisonNumber => getLink(prisonNumber, DocumentSubjectType.OFFENDER_NOT_ELIGIBLE_FORM),
      text: 'Not eligible',
    },
    {
      link: prisonNumber => getLink(prisonNumber, DocumentSubjectType.OFFENDER_NOT_SUITABLE_FORM),
      text: 'Not suitable',
    },
  ],
  [AssessmentStatus.ADDRESS_UNSUITABLE]: [
    ...commonForms,
    {
      link: prisonNumber => getLink(prisonNumber, DocumentSubjectType.OFFENDER_ADDRESS_UNSUITABLE_FORM),
      text: 'Address unsuitable',
    },
  ],
  [AssessmentStatus.POSTPONED]: [
    ...commonForms,
    {
      link: prisonNumber => getLink(prisonNumber, DocumentSubjectType.OFFENDER_ADDRESS_UNSUITABLE_FORM),
      text: 'Address unsuitable',
    },
    {
      link: prisonNumber => getLink(prisonNumber, DocumentSubjectType.OFFENDER_POSTPONED_FORM),
      text: 'Postponed',
    },
  ],
  [AssessmentStatus.APPROVED]: [
    ...commonForms,
    {
      link: prisonNumber => getLink(prisonNumber, DocumentSubjectType.OFFENDER_APPROVED_FORM),
      text: 'Approved',
    },
    {
      link: prisonNumber => getLink(prisonNumber, DocumentSubjectType.OFFENDER_AGENCY_NOTIFICATION_FORM),
      text: 'Agency notification',
    },
    {
      link: prisonNumber => getLink(prisonNumber, DocumentSubjectType.OFFENDER_CANCEL_AGENCY_NOTIFICATION_FORM),
      text: 'Cancel agency notification',
    },
  ],
  [AssessmentStatus.REFUSED]: [
    ...commonForms,
    {
      link: prisonNumber => getLink(prisonNumber, DocumentSubjectType.OFFENDER_REFUSED_FORM),
      text: 'Refused',
    },
  ],
  [AssessmentStatus.NOT_STARTED]: [],
  [AssessmentStatus.ELIGIBILITY_AND_SUITABILITY_IN_PROGRESS]: [],
  [AssessmentStatus.AWAITING_ADDRESS_AND_RISK_CHECKS]: [],
  [AssessmentStatus.ADDRESS_AND_RISK_CHECKS_IN_PROGRESS]: [],
  [AssessmentStatus.AWAITING_PRE_DECISION_CHECKS]: [],
  [AssessmentStatus.AWAITING_DECISION]: [],
  [AssessmentStatus.AWAITING_PRE_RELEASE_CHECKS]: [],
  [AssessmentStatus.PASSED_PRE_RELEASE_CHECKS]: [],
  [AssessmentStatus.AWAITING_REFUSAL]: [],
  [AssessmentStatus.TIMED_OUT]: [],
  [AssessmentStatus.OPTED_OUT]: [],
  [AssessmentStatus.RELEASED_ON_HDC]: [],
}

const getLink = (prisonNumber: string, documentSubjectType: DocumentSubjectType): string =>
  paths.offender.document({ prisonNumber, documentSubjectType })
