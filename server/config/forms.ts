import paths from '../routes/paths'
import AssessmentStatus from '../enumeration/assessmentStatus'
import DocumentSubjectType from '../enumeration/documentSubjectType'

export type Form = {
  link: (prisonNumber: string) => string
  text: string
}

export const getBaseForms: Form[] = [
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

export const getStatusFormsMap: { [key in AssessmentStatus]?: Form[] } = {
  [AssessmentStatus.ELIGIBLE_AND_SUITABLE]: [],
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
    {
      link: prisonNumber => getLink(prisonNumber, DocumentSubjectType.OFFENDER_ADDRESS_UNSUITABLE_FORM),
      text: 'Address unsuitable',
    },
  ],
  [AssessmentStatus.POSTPONED]: [
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
    {
      link: prisonNumber => getLink(prisonNumber, DocumentSubjectType.OFFENDER_REFUSED_FORM),
      text: 'Refused',
    },
  ],
}

export const getLink = (prisonNumber: string, documentSubjectType: DocumentSubjectType): string =>
  paths.offender.document({ prisonNumber, documentSubjectType })
