import { Request, Response } from 'express'
import CaseAdminCaseloadService, { Case } from '../../services/caseAdminCaseloadService'
import paths from '../paths'
import AssessmentStatus from '../../enumeration/assessmentStatus'

export default class CaseloadRoutes {
  static readonly POSTPONED_STATUS = [AssessmentStatus.POSTPONED]

  static readonly TO_WORK_ON_BY_YOU_STATUS = [
    AssessmentStatus.ELIGIBILITY_AND_SUITABILITY_IN_PROGRESS,
    AssessmentStatus.ELIGIBLE_AND_SUITABLE,
    AssessmentStatus.AWAITING_PRE_DECISION_CHECKS,
    AssessmentStatus.APPROVED,
    AssessmentStatus.AWAITING_PRE_RELEASE_CHECKS,
    AssessmentStatus.PASSED_PRE_RELEASE_CHECKS,
  ]

  static readonly WITH_PROBATION_STATUS = [
    AssessmentStatus.ADDRESS_AND_RISK_CHECKS_IN_PROGRESS,
    AssessmentStatus.AWAITING_ADDRESS_AND_RISK_CHECKS,
    AssessmentStatus.APPROVED,
  ]

  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const cases = await this.caseAdminCaseloadService.getCaseAdminCaseload(
      req?.middleware?.clientToken,
      res.locals.activeCaseLoadId,
    )

    const postponedCases = this.filterCasesByStatus(cases, CaseloadRoutes.POSTPONED_STATUS)
    const toWorkOnByYouCases = this.filterCasesByStatus(cases, CaseloadRoutes.TO_WORK_ON_BY_YOU_STATUS)
    const withProbationCases = this.filterCasesByStatus(cases, CaseloadRoutes.WITH_PROBATION_STATUS)

    res.render('pages/caseAdmin/caseload', {
      toWorkOnByYouCases: toWorkOnByYouCases.map(this.mapToViewModel),
      postponedCases: postponedCases.map(this.mapToViewModel),
      withProbationCases: withProbationCases
        .filter(
          aCase =>
            !(aCase.status === AssessmentStatus.AWAITING_ADDRESS_AND_RISK_CHECKS && !aCase.addressChecksComplete),
        )
        .map(this.mapToViewModel),
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
