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

  static readonly POSTPONED_STATUSES = [AssessmentStatus.POSTPONED]

  static readonly READY_FOR_RELEASE_STATUSES = [AssessmentStatus.PASSED_PRE_RELEASE_CHECKS]

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
    const view = req.query.view || 'active-applications'
    const activeApplicationView = view === 'active-applications'

    const cases = await this.communityOffenderManagerCaseloadService.getCommunityOffenderManagerCaseload(
      req?.middleware?.clientToken,
      res.locals.agent,
      user as ProbationUser,
    )

    const inactiveApplications = this.filterCasesByStatus(cases, CaseloadRoutes.INACTIVE_APPLICATIONS_STATUSES, false)
    const postponedCases = this.filterCasesByStatus(cases, CaseloadRoutes.POSTPONED_STATUSES, false)
    const readyForReleaseCases = this.filterCasesByStatus(cases, CaseloadRoutes.READY_FOR_RELEASE_STATUSES, false)
    const withPrisonAdminCases = this.filterCasesByStatus(cases, CaseloadRoutes.WITH_PRISON_ADMIN_STATUSES, false)
    const toWorkOnByYouCases = this.filterCasesByStatus(
      cases,
      CaseloadRoutes.INACTIVE_APPLICATIONS_STATUSES.concat(CaseloadRoutes.READY_FOR_RELEASE_STATUSES)
        .concat(CaseloadRoutes.POSTPONED_STATUSES)
        .concat(CaseloadRoutes.WITH_PRISON_ADMIN_STATUSES),
      true,
    )

    res.render('pages/communityOffenderManager/caseload', {
      activeApplicationView,
      toWorkOnByYouCases: toWorkOnByYouCases.map(this.mapToViewModel),
      postponedCases: postponedCases.map(this.mapToViewModel),
      readyForReleaseCases: readyForReleaseCases.map(this.mapToViewModel),
      inactiveApplications: inactiveApplications.map(this.mapToViewModel),
      withPrisonAdminCases: withPrisonAdminCases.map(this.mapToViewModel),
    })
  }

  filterCasesByStatus = (cases: Case[], statuses: AssessmentStatus[], excludeStatuses: boolean): Case[] =>
    cases.filter(aCase => (excludeStatuses ? !statuses.includes(aCase.status) : statuses.includes(aCase.status)))

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
