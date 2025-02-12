import { Request, Response } from 'express'
import CaseAdminCaseloadService, { Case } from '../../services/caseAdminCaseloadService'
import paths from '../paths'

export default class CaseloadRoutes {
  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const cases = await this.caseAdminCaseloadService.getCaseAdminCaseload(
      req?.middleware?.clientToken,
      res.locals.activeCaseLoadId,
    )

    const postponedCases = cases.filter(aCase => aCase.isPostponed).map(aCase => this.mapToViewModel(aCase))
    const toWorkOnByYouCases = cases.filter(aCase => !aCase.isPostponed).map(aCase => this.mapToViewModel(aCase))
    const withProbationCases = cases.map(aCase => this.mapToViewModel(aCase))
    res.render('pages/caseAdmin/caseload', { toWorkOnByYouCases, postponedCases, withProbationCases })
  }

  mapToViewModel = (aCase: Case) => {
    return {
      createLink: paths.prison.assessment.home(aCase),
      ...aCase,
    }
  }
}
