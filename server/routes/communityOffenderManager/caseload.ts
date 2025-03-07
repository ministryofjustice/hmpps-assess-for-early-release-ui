import { Request, Response } from 'express'
import CommunityOffenderManagerCaseloadService from '../../services/communityOffenderManagerCaseloadService'
import { ProbationUser } from '../../interfaces/hmppsUser'
import paths from '../paths'

export default class CaseloadRoutes {
  constructor(private readonly communityOffenderManagerCaseloadService: CommunityOffenderManagerCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { user } = res.locals
    const offenderSummaryList = await this.communityOffenderManagerCaseloadService.getCommunityOffenderManagerCaseload(
      req?.middleware?.clientToken,
      res.locals.agent,
      user as ProbationUser,
    )

    const caseload = offenderSummaryList.map(offender => {
      return {
        createLink: paths.probation.assessment.home(offender),
        name: offender.name,
        prisonNumber: offender.prisonNumber,
        probationPractitioner: offender.probationPractitioner,
        hdced: offender.hdced,
        workingDaysToHdced: offender.workingDaysToHdced,
      }
    })
    res.render('pages/communityOffenderManager/caseload', { caseload })
  }
}
