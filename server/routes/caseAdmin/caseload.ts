import { Request, Response } from 'express'
import CaseAdminCaseloadService, { Case } from '../../services/caseAdminCaseloadService'
import paths from '../paths'
import AssessmentStatus from '../../enumeration/assessmentStatus'

export default class CaseloadRoutes {
  static readonly POSTPONED_STATUSES = [AssessmentStatus.POSTPONED]

  static readonly TO_WORK_ON_BY_YOU_STATUSES = [
    AssessmentStatus.ELIGIBILITY_AND_SUITABILITY_IN_PROGRESS,
    AssessmentStatus.ELIGIBLE_AND_SUITABLE,
    AssessmentStatus.AWAITING_PRE_DECISION_CHECKS,
    AssessmentStatus.APPROVED,
    AssessmentStatus.AWAITING_PRE_RELEASE_CHECKS,
  ]

  static readonly WITH_PROBATION_STATUSES = [
    AssessmentStatus.ADDRESS_AND_RISK_CHECKS_IN_PROGRESS,
    AssessmentStatus.AWAITING_ADDRESS_AND_RISK_CHECKS,
    AssessmentStatus.APPROVED,
  ]

  static readonly INACTIVE_APPLICATIONS_STATUSES = [
    AssessmentStatus.REFUSED,
    AssessmentStatus.TIMED_OUT,
    AssessmentStatus.OPTED_OUT,
    AssessmentStatus.INELIGIBLE_OR_UNSUITABLE,
  ]

  static readonly WITH_DECISION_MAKER_STATUSES = [AssessmentStatus.AWAITING_DECISION]

  static readonly READY_FOR_RELEASE_STATUSES = [AssessmentStatus.PASSED_PRE_RELEASE_CHECKS]

  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const view = req.query.view || 'active-applications'
    const activeApplicationView = view === 'active-applications'

    const cases = await this.caseAdminCaseloadService.getCaseAdminCaseload(
      req?.middleware?.clientToken,
      res.locals.activeCaseLoadId,
    )

    const postponedCases = this.filterCasesByStatus(cases, CaseloadRoutes.POSTPONED_STATUSES)
    const toWorkOnByYouCases = this.filterCasesByStatus(cases, CaseloadRoutes.TO_WORK_ON_BY_YOU_STATUSES)
    const withDecisionMakerCases = this.filterCasesByStatus(cases, CaseloadRoutes.WITH_DECISION_MAKER_STATUSES)
    const withProbationCases = this.filterCasesByStatus(cases, CaseloadRoutes.WITH_PROBATION_STATUSES)
    const inactiveApplications = this.filterCasesByStatus(cases, CaseloadRoutes.INACTIVE_APPLICATIONS_STATUSES)
    const readyForReleaseCases = this.filterCasesByStatus(cases, CaseloadRoutes.READY_FOR_RELEASE_STATUSES)

    res.render('pages/caseAdmin/caseload', {
      activeApplicationView,
      toWorkOnByYouCases: toWorkOnByYouCases.map(this.mapToViewModel),
      postponedCases: postponedCases.map(this.mapToViewModel),
      withDecisionMakerCases: withDecisionMakerCases.map(this.mapToViewModel),
      withProbationCases: withProbationCases
        .filter(
          aCase =>
            !(aCase.status === AssessmentStatus.AWAITING_ADDRESS_AND_RISK_CHECKS && !aCase.addressChecksComplete),
        )
        .map(this.mapToViewModel),
      inactiveApplications: inactiveApplications.map(this.mapToViewModel),
      readyForReleaseCases: readyForReleaseCases.map(this.mapToViewModel),
    })
  }

  mapToViewModel = (aCase: Case) => {
    return {
      createLink: paths.prison.assessment.home(aCase),
      ...aCase,
    }
  }

  filterCasesByStatus = (cases: Case[], statuses: AssessmentStatus[]): Case[] =>
    cases.filter(aCase => statuses.includes(aCase.status))
}
