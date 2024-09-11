import { Request, Response } from 'express'

export default class AssessmentRoutes {
  constructor() {}

  GET = async (req: Request, res: Response): Promise<void> => {
    res.render('pages/caseAdmin/assessment')
  }
}
