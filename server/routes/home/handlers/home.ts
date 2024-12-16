import { Request, Response } from 'express'
import { hasRole } from '../../../utils/utils'
import AuthRole from '../../../enumeration/authRole'

export default class HomeRoutes {
  GET = async (req: Request, res: Response): Promise<void> => {
    const viewContext = {
      shouldShowSupportCard: hasRole(req.user, AuthRole.SUPPORT),
      shouldShowCaAssessForHDCCard: hasRole(req.user, AuthRole.CASE_ADMIN),
      shouldShowComAssessForHDCCard: hasRole(req.user, AuthRole.RESPONSIBLE_OFFICER),
      shouldShowDmAssessForHDCCard: hasRole(req.user, AuthRole.DECISION_MAKER),
    }
    res.render('pages/index', viewContext)
  }
}
