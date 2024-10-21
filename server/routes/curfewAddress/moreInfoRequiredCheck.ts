import { Request, Response } from 'express'
import { CaseAdminCaseloadService } from '../../services'
import { convertToTitleCase } from '../../utils/utils'
import { validateRequest } from '../../middleware/setUpValidationMiddleware'
import paths from '../paths'

export default class MoreInfoRequiredCheckRoutes {
  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentSummary(
      req?.middleware?.clientToken,
      req.params.prisonNumber,
    )
    res.render('pages/curfewAddress/moreInfoRequiredCheck', {
      assessmentSummary: {
        ...assessmentSummary,
        name: convertToTitleCase(`${assessmentSummary.forename} ${assessmentSummary.surname}`.trim()),
      },
    })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    const validationMessage = 'Please select whether you need to enter any more information'
    validateRequest(req, body => {
      return body.moreInfoRequiredCheck ? [] : [{ field: 'moreInfoRequiredCheck', message: validationMessage }]
    })

    if (req.body.moreInfoRequiredCheck === 'no') {
      return res.redirect(
        paths.prison.assessment.curfewAddress.requestMoreAddressChecks({
          prisonNumber: req.params.prisonNumber,
          checkRequestId: req.params.checkRequestId,
        }),
      )
    }

    return res.redirect(
      paths.prison.assessment.curfewAddress.moreInformationRequired({
        prisonNumber: req.params.prisonNumber,
        checkRequestId: req.params.checkRequestId,
      }),
    )
  }
}
