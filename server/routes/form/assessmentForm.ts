import { Request, Response } from 'express'
import moment from 'moment'
import FormService from '../../services/formService'
import { Agent, DocumentSubjectType } from '../../@types/assessForEarlyReleaseApiClientTypes'

export default class AssessmentFormRoutes {
  constructor(private readonly formService: FormService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const agent = res.locals.agent as Agent
    const { prisonNumber } = req.params
    const documentSubjectType = this.getValidDocumentSubjectType(req)
    const pageData = await this.formService.getForm(
      req?.middleware?.clientToken,
      agent,
      prisonNumber,
      documentSubjectType,
    )
    res.renderPDF({ filename: this.getDownloadFileName(prisonNumber, documentSubjectType) }, pageData)
  }

  private getDownloadFileName(prisonNumber: string, documentSubjectType: DocumentSubjectType) {
    const today = moment().format('DD-MM-YY')
    return `${prisonNumber}_${documentSubjectType}_${today}.pdf`
  }

  private getValidDocumentSubjectType(req: Request) {
    const { documentSubjectType } = req.params

    switch (documentSubjectType) {
      case 'OFFENDER_ELIGIBLE_FORM':
      case 'OFFENDER_ADDRESS_CHECKS_INFORMATION_FORM':
      case 'OFFENDER_ADDRESS_CHECKS_FORM':
      case 'OFFENDER_OPT_OUT_FORM':
      case 'OFFENDER_NOT_ELIGIBLE_FORM':
      case 'OFFENDER_NOT_SUITABLE_FORM':
      case 'OFFENDER_ADDRESS_UNSUITABLE_FORM':
      case 'OFFENDER_POSTPONED_FORM':
      case 'OFFENDER_NOT_ENOUGH_TIME_FORM':
      case 'OFFENDER_APPROVED_FORM':
      case 'OFFENDER_AGENCY_NOTIFICATION_FORM':
      case 'OFFENDER_CANCEL_AGENCY_NOTIFICATION_FORM':
      case 'OFFENDER_REFUSED_FORM':
        return documentSubjectType as DocumentSubjectType
      default:
        throw new Error(`Unknown document type : ${documentSubjectType}`)
    }
  }
}
