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

  static readonly READY_FOR_RELEASE_STATUSES = [AssessmentStatus.PASSED_PRE_RELEASE_CHECKS]

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
    const readyForReleaseCases = this.filterCasesByStatus(cases, CaseloadRoutes.READY_FOR_RELEASE_STATUSES, false)
    const otherCases = this.filterCasesByStatus(
      cases,
      CaseloadRoutes.INACTIVE_APPLICATIONS_STATUSES.concat(CaseloadRoutes.READY_FOR_RELEASE_STATUSES),
      true,
    )

    res.render('pages/communityOffenderManager/caseload', {
      activeApplicationView,
      otherCases: otherCases.map(this.mapToViewModel),
      readyForReleaseCases: readyForReleaseCases.map(this.mapToViewModel),
      inactiveApplications: inactiveApplications.map(this.mapToViewModel),
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
