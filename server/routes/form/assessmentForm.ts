import { Request, Response } from 'express'
import moment from 'moment'
import FormService from '../../services/formService'
import { Agent, DocumentSubjectType } from '../../@types/assessForEarlyReleaseApiClientTypes'
import { getValidDocumentSubjectType } from '../../utils/utils'

export default class AssessmentFormRoutes {
  constructor(private readonly formService: FormService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const agent = res.locals.agent as Agent
    const { prisonNumber } = req.params
    const documentSubjectType = getValidDocumentSubjectType(req.params.documentSubjectType)
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
}
