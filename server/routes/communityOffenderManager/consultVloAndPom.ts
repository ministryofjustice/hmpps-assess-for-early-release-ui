import { Request, Response } from 'express'
import { CaseAdminCaseloadService, ComChecksService } from '../../services'
import { validateRequest } from '../../middleware/setUpValidationMiddleware'
import { FieldValidationError } from '../../@types/FieldValidationError'
import paths from '../paths'

export default class ConsultVloAndPomRoutes {
  constructor(
    private readonly caseAdminCaseloadService: CaseAdminCaseloadService,
    private readonly comChecksService: ComChecksService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { prisonNumber } = req.params
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentOverviewSummary(
      req?.middleware?.clientToken,
      res.locals.agent,
      prisonNumber,
    )

    let victimContactSchemeOptedIn = null
    if (
      assessmentSummary.victimContactSchemeOptedIn !== undefined &&
      assessmentSummary.victimContactSchemeOptedIn !== null
    ) {
      victimContactSchemeOptedIn = assessmentSummary.victimContactSchemeOptedIn ? 'true' : 'false'
    }

    res.render('pages/communityOffenderManager/consultVloAndPom', {
      assessmentSummary,
      prisonNumber,
      victimContactSchemeOptedIn,
    })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    const { victimContactSchemeOptedIn, victimContactSchemeRequests, pomBehaviourInformation } = req.body
    const { prisonNumber } = req.params

    validateRequest(req, () => {
      const validationErrors: FieldValidationError[] = []
      if (!victimContactSchemeOptedIn) {
        validationErrors.push({
          field: 'victimContactSchemeOptedIn',
          message: 'Select if this case qualifies for the Victim Contact Scheme and whether the victim opted in?',
        })
      } else if (victimContactSchemeOptedIn === 'true') {
        if (!victimContactSchemeRequests) {
          validationErrors.push({
            field: 'victimContactSchemeRequests',
            message: 'Enter details of victim requests',
          })
        }
      }

      if (!pomBehaviourInformation) {
        validationErrors.push({
          field: 'pomBehaviourInformation',
          message: 'Enter information provided by the POM',
        })
      }

      return validationErrors
    })

    await this.comChecksService.updateVloAndPomConsultation(
      req?.middleware?.clientToken,
      res.locals.agent,
      prisonNumber,
      victimContactSchemeOptedIn,
      victimContactSchemeRequests,
      pomBehaviourInformation,
    )

    return res.redirect(
      paths.probation.assessment.home({
        prisonNumber: req.params.prisonNumber,
      }),
    )
  }
}
