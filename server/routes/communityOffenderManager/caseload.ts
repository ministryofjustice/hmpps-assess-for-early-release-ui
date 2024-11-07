import { Request, Response } from 'express'
import CommunityOffenderManagerCaseloadService from '../../services/communityOffenderManagerCaseloadService'

export default class CaseloadRoutes {
  constructor(private readonly communityOffenderManagerCaseloadService: CommunityOffenderManagerCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    res.render('pages/communityOffenderManager/caseload')
  }
}
