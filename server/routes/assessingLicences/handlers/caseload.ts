import { Request, Response } from 'express'

export default class CaseloadRoutes {
  GET = async (req: Request, res: Response): Promise<void> => {
    res.render('pages/assessingLicences/caseload')
  }
}
