import { Request, Response } from 'express'
import CommunityOffenderManagerCaseloadService, { Case } from '../../services/communityOffenderManagerCaseloadService'
import { ProbationUser } from '../../interfaces/hmppsUser'
import paths from '../paths'
import AssessmentStatus from '../../enumeration/assessmentStatus'
import { tasks, UsersWithTypes } from '../../config/tasks'

export default class CaseloadRoutes {
  static readonly INACTIVE_APPLICATIONS_STATUSES = [
    AssessmentStatus.REFUSED,
    AssessmentStatus.TIMED_OUT,
    AssessmentStatus.OPTED_OUT,
    AssessmentStatus.INELIGIBLE_OR_UNSUITABLE,
  ]

  static readonly TO_WORK_ON_BY_YOU_OR_TEAM_STATUSES = [
    AssessmentStatus.AWAITING_ADDRESS_AND_RISK_CHECKS,
    AssessmentStatus.ADDRESS_AND_RISK_CHECKS_IN_PROGRESS,
  ]

  static readonly POSTPONED_STATUSES = [AssessmentStatus.POSTPONED]

  static readonly ASSESSMENT_COMPLETED_STATUSES = [AssessmentStatus.PASSED_PRE_RELEASE_CHECKS]

  static readonly WITH_DECISION_MAKER_STATUSES = [AssessmentStatus.AWAITING_DECISION]

  static readonly WITH_PRISON_ADMIN_STATUSES = [
    AssessmentStatus.ELIGIBILITY_AND_SUITABILITY_IN_PROGRESS,
    AssessmentStatus.ELIGIBLE_AND_SUITABLE,
    AssessmentStatus.ADDRESS_UNSUITABLE,
    AssessmentStatus.AWAITING_PRE_DECISION_CHECKS,
    AssessmentStatus.APPROVED,
    AssessmentStatus.AWAITING_PRE_RELEASE_CHECKS,
  ]

  constructor(private readonly communityOffenderManagerCaseloadService: CommunityOffenderManagerCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { user } = res.locals
    const view = req.query.view || 'my-cases'

    let caseload
    if (view === 'team-cases') {
      caseload = await this.communityOffenderManagerCaseloadService.getCommunityOffenderManagerTeamCaseload(
        req?.middleware?.clientToken,
        res.locals.agent,
        user as ProbationUser,
      )
    } else {
      caseload = await this.communityOffenderManagerCaseloadService.getCommunityOffenderManagerStaffCaseload(
        req?.middleware?.clientToken,
        res.locals.agent,
        user as ProbationUser,
      )
    }

    if (view !== 'inactive-applications') {
      const postponedCases = this.filterCasesByStatus(caseload, CaseloadRoutes.POSTPONED_STATUSES)
      const assessmentCompltedCases = this.filterCasesByStatus(caseload, CaseloadRoutes.ASSESSMENT_COMPLETED_STATUSES)
      const withDecisionMakerCases = this.filterCasesByStatus(caseload, CaseloadRoutes.WITH_DECISION_MAKER_STATUSES)
      const withPrisonAdminCases = this.filterCasesByStatus(caseload, CaseloadRoutes.WITH_PRISON_ADMIN_STATUSES)
      const toWorkOnByYouOrTeamCases = this.filterCasesByStatus(
        caseload,
        CaseloadRoutes.TO_WORK_ON_BY_YOU_OR_TEAM_STATUSES,
      )

      res.render('pages/communityOffenderManager/caseload', {
        view,
        toWorkOnByYouOrTeamCases: toWorkOnByYouOrTeamCases.map(this.mapToViewModel),
        postponedCases: postponedCases.map(this.mapToViewModel),
        assessmentCompltedCases: assessmentCompltedCases.map(this.mapToViewModel),
        withDecisionMakerCases: withDecisionMakerCases.map(this.mapToViewModel),
        withPrisonAdminCases: withPrisonAdminCases.map(this.mapToViewModel),
      })
    } else {
      const inactiveApplications = this.filterCasesByStatus(caseload, CaseloadRoutes.INACTIVE_APPLICATIONS_STATUSES)

      res.render('pages/communityOffenderManager/caseload', {
        view,
        inactiveApplications: inactiveApplications.map(this.mapToViewModel),
      })
    }
  }

  filterCasesByStatus = (cases: Case[], statuses: AssessmentStatus[]): Case[] =>
    cases.filter(aCase => statuses.includes(aCase.status))

  mapToViewModel = (aCase: Case) => {
    return {
      ...aCase,
      createLink: paths.probation.assessment.home(aCase),
      currentTask: this.taskDescription(aCase.currentTask),
    }
  }

  taskDescription = (taskCode: string): string => {
    if (!taskCode) {
      return null
    }

    for (const tasksForUser of Object.keys(tasks)) {
      const task = tasks[tasksForUser as UsersWithTypes].find(aTask => aTask.code === taskCode)
      if (task) {
        return task.title
      }
    }
    return null
  }
}
