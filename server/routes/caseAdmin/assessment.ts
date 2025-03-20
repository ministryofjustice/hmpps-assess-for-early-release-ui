import { Request, Response } from 'express'
import { CaseAdminCaseloadService } from '../../services'
import AssessmentStatus from '../../enumeration/assessmentStatus'
import paths from '../paths'
import { AssessmentOverviewSummary } from '../../@types/assessForEarlyReleaseApiClientTypes'
import documentSubjectType from '../../enumeration/documentSubjectType'

export default class AssessmentRoutes {
  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentOverviewSummary(
      req?.middleware?.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )

    res.render('pages/caseAdmin/assessment', {
      assessmentSummary: {
        ...assessmentSummary,
        tasks: assessmentSummary.tasks.PRISON_CA,
        formsToShow: this.getFormsToShow(assessmentSummary),
      },
    })
  }

  private getFormsToShow(assessmentSummary: AssessmentOverviewSummary): { link: string; text: string }[] {
    const { prisonNumber, status } = assessmentSummary
    const baseForms = [
      {
        link: this.getFormPath(prisonNumber, documentSubjectType.OFFENDER_ELIGIBLE_FORM),
        text: 'Eligible',
      },
      {
        link: this.getFormPath(prisonNumber, documentSubjectType.OFFENDER_ADDRESS_CHECKS_INFORMATION_FORM),
        text: 'Information about address checks',
      },
      {
        link: this.getFormPath(prisonNumber, documentSubjectType.OFFENDER_ADDRESS_CHECKS_FORM),
        text: 'Address checks',
      },
      {
        link: this.getFormPath(prisonNumber, documentSubjectType.OFFENDER_OPT_OUT_FORM),
        text: 'Opt out',
      },
    ]

    return status === AssessmentStatus.INELIGIBLE_OR_UNSUITABLE || status === AssessmentStatus.NOT_STARTED
      ? this.getStatusForms(prisonNumber, status as AssessmentStatus)
      : [...baseForms, ...this.getStatusForms(prisonNumber, status as AssessmentStatus)]
  }

  private getStatusForms(prisonNumber: string, status: AssessmentStatus): { link: string; text: string }[] {
    const statusFormsMap: { [key in AssessmentStatus]?: { link: string; text: string }[] } = {
      [AssessmentStatus.ELIGIBLE_AND_SUITABLE]: [],
      [AssessmentStatus.INELIGIBLE_OR_UNSUITABLE]: [
        {
          link: this.getFormPath(prisonNumber, documentSubjectType.OFFENDER_NOT_ELIGIBLE_FORM),
          text: 'Not eligible',
        },
        {
          link: this.getFormPath(prisonNumber, documentSubjectType.OFFENDER_NOT_SUITABLE_FORM),
          text: 'Not suitable',
        },
      ],
      [AssessmentStatus.ADDRESS_UNSUITABLE]: [
        {
          link: this.getFormPath(prisonNumber, documentSubjectType.OFFENDER_ADDRESS_UNSUITABLE_FORM),
          text: 'Address unsuitable',
        },
      ],
      [AssessmentStatus.POSTPONED]: [
        {
          link: this.getFormPath(prisonNumber, documentSubjectType.OFFENDER_ADDRESS_UNSUITABLE_FORM),
          text: 'Address unsuitable',
        },
        {
          link: this.getFormPath(prisonNumber, documentSubjectType.OFFENDER_POSTPONED_FORM),
          text: 'Postponed',
        },
      ],
      [AssessmentStatus.APPROVED]: [
        {
          link: this.getFormPath(prisonNumber, documentSubjectType.OFFENDER_APPROVED_FORM),
          text: 'Approved',
        },
        {
          link: this.getFormPath(prisonNumber, documentSubjectType.OFFENDER_AGENCY_NOTIFICATION_FORM),
          text: 'Agency notification',
        },
        {
          link: this.getFormPath(prisonNumber, documentSubjectType.OFFENDER_CANCEL_AGENCY_NOTIFICATION_FORM),
          text: 'Cancel agency notification',
        },
      ],
      [AssessmentStatus.REFUSED]: [
        {
          link: this.getFormPath(prisonNumber, documentSubjectType.OFFENDER_REFUSED_FORM),
          text: 'Refused',
        },
      ],
    }

    return statusFormsMap[status] || []
  }

  private getFormPath(prisonNumber: string, docSubjectType: documentSubjectType): string {
    return paths.offender.document({ prisonNumber, documentSubjectType: docSubjectType })
  }
}
