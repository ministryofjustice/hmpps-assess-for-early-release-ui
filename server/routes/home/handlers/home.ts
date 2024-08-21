import { Request, Response } from 'express'
import { hasRole } from '../../../utils/utils'
import AuthRole from '../../../enumeration/authRole'

export default class HomeRoutes {
  GET = async (req: Request, res: Response): Promise<void> => {
    const viewContext = {
      shouldShowSupportCard: hasRole(req.user, AuthRole.SUPPORT),
    }
    res.render('pages/index', viewContext)
  }
}
