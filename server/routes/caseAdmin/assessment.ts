import { Request, Response } from 'express'
import { CaseAdminCaseloadService } from '../../services'
import { getStatusFormsMap } from '../../config/forms'
import { ContactResponse } from '../../@types/assessForEarlyReleaseApiClientTypes'

export default class AssessmentRoutes {
  constructor(private readonly caseAdminCaseloadService: CaseAdminCaseloadService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentOverviewSummary(
      req?.middleware?.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )

    const assessmentContactsResponse = await this.caseAdminCaseloadService.getCurrentAssessmentContactDetails(
      req?.middleware?.clientToken,
      res.locals.agent,
      req.params.prisonNumber,
    )

    const { status } = assessmentSummary
    res.render('pages/caseAdmin/assessment', {
      assessmentSummary: {
        ...assessmentSummary,
        tasks: assessmentSummary.tasks.PRISON_CA,
        contactList: this.createContactData(assessmentContactsResponse.contacts),
        formsToShow: getStatusFormsMap[status],
      },
    })
  }

  private createContactData(contacts: ContactResponse[]) {
    const probationCom = this.createContact(contacts, 'PROBATION_COM')
    const prisonDm = this.createContact(contacts, 'PRISON_DM')
    const prisonCa = this.createContact(contacts, 'PRISON_CA')
    return [prisonCa, probationCom, prisonDm]
  }

  private createContact(
    contacts: ContactResponse[],
    role: 'PRISON_CA' | 'PRISON_DM' | 'PROBATION_COM',
  ): ContactResponse {
    const contact = contacts ? contacts.find(item => item.userRole === role) : null
    return contact || this.createDummyContact(role)
  }

  private createDummyContact(role: 'PRISON_CA' | 'PRISON_DM' | 'PROBATION_COM'): ContactResponse {
    return {
      userRole: role,
      fullName: null,
      email: null,
      locationName: null,
    }
  }
}
