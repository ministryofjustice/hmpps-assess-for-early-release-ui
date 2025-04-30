import { Request, Response } from 'express'
import { CaseAdminCaseloadService } from '../../services'
import { getStatusFormsMap } from '../../config/forms'
import { ContactResponse } from '../../@types/assessForEarlyReleaseApiClientTypes'
import AssessmentStatus from '../../enumeration/assessmentStatus'

export default class AssessmentRoutes {
  static readonly OPT_OUT_AVAILABLE_STATUSES = [
    AssessmentStatus.ELIGIBLE_AND_SUITABLE,
    AssessmentStatus.AWAITING_ADDRESS_AND_RISK_CHECKS,
    AssessmentStatus.ADDRESS_AND_RISK_CHECKS_IN_PROGRESS,
    AssessmentStatus.ADDRESS_UNSUITABLE,
    AssessmentStatus.AWAITING_PRE_DECISION_CHECKS,
    AssessmentStatus.AWAITING_DECISION,
    AssessmentStatus.APPROVED,
    AssessmentStatus.AWAITING_PRE_RELEASE_CHECKS,
    AssessmentStatus.PASSED_PRE_RELEASE_CHECKS,
  ]

  static readonly POSTPONE_AVAILABLE_STATUSES = [
    AssessmentStatus.ADDRESS_UNSUITABLE,
    AssessmentStatus.AWAITING_PRE_DECISION_CHECKS,
    AssessmentStatus.AWAITING_DECISION,
    AssessmentStatus.APPROVED,
    AssessmentStatus.AWAITING_PRE_RELEASE_CHECKS,
    AssessmentStatus.PASSED_PRE_RELEASE_CHECKS,
  ]

  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentOverviewSummary(
      req?.middleware?.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )

    const assessmentContactsResponse = await this.caseAdminCaseloadService.getCurrentAssessmentContactDetails(
      req?.middleware?.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )

    const { status } = assessmentSummary
    res.render('pages/caseAdmin/assessment', {
      assessmentSummary: {
        ...assessmentSummary,
        tasks: assessmentSummary.tasks.PRISON_CA,
        contactList: this.createContactData(assessmentContactsResponse.contacts),
        formsToShow: getStatusFormsMap[status],
      },
      availableActions: {
        optInAvailable: status === 'OPTED_OUT',
        optOutAvailable: AssessmentRoutes.OPT_OUT_AVAILABLE_STATUSES.includes(status as AssessmentStatus),
        postponeAvailable: AssessmentRoutes.POSTPONE_AVAILABLE_STATUSES.includes(status as AssessmentStatus),
      },
    })
  }

  private createContactData(contacts: ContactResponse[]) {
    const probationCom = this.createContact(contacts, 'PROBATION_COM')
    const prisonDm = this.createContact(contacts, 'PRISON_DM')
    const prisonCa = this.createContact(contacts, 'PRISON_CA')
    return [prisonCa, probationCom, prisonDm]
  }

  private createContact(
    contacts: ContactResponse[],
    role: 'PRISON_CA' | 'PRISON_DM' | 'PROBATION_COM',
  ): ContactResponse {
    const contact = contacts?.find(item => item.userRole === role)
    return contact || this.createDummyContact(role)
  }

  private createDummyContact(role: 'PRISON_CA' | 'PRISON_DM' | 'PROBATION_COM'): ContactResponse {
    return {
      userRole: role,
      fullName: null,
      email: null,
      locationName: null,
    }
  }
}
