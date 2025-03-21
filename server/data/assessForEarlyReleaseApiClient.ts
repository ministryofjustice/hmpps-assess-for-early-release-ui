import type {
  _AddressSummary,
  _CheckRequestSummary,
  _EligibilityAndSuitabilityCaseView,
  _EligibilityCriterionView,
  _OffenderSummary,
  _ResidentialChecksTaskView,
  _ResidentSummary,
  _StandardAddressCheckRequestSummary,
  _SuitabilityCriterionView,
  AddressSummary,
  AddStandardAddressCheckRequest,
  Agent,
  CheckRequestSummary,
  CriterionCheck,
  DeliusStaff,
  EligibilityAndSuitabilityCaseView,
  EligibilityCriterionView,
  OffenderSummary,
  OptOutRequest,
  PrisonUserDetails,
  ResidentialChecksTaskAnswersSummary,
  ResidentialChecksTaskView,
  ResidentialChecksView,
  ResidentSummary,
  SaveResidentialChecksTaskAnswersRequest,
  StandardAddressCheckRequestSummary,
  SuitabilityCriterionView,
  AddResidentRequest,
  UpdateCaseAdminAdditionInfoRequest,
  DocumentSubjectType,
  _AssessmentOverviewSummary,
  AssessmentOverviewSummary,
} from '../@types/assessForEarlyReleaseApiClientTypes'
import config, { ApiConfig } from '../config'
import RestClient from './restClient'
import { parseIsoDate } from '../utils/utils'

export default class AssessForEarlyReleaseApiClient {
  private restClient: RestClient

  constructor(token: string, agent?: Agent) {
    const defaultHeaders = {
      username: agent?.username,
      fullName: agent?.fullName,
      role: agent?.role,
      onBehalfOf: agent?.onBehalfOf,
    }
    this.restClient = new RestClient(
      'assessForEarlyReleaseApi',
      config.apis.assessForEarlyReleaseApi as ApiConfig,
      token,
      defaultHeaders,
    )
  }

  async getCaseAdminCaseload(prisonCode: string): Promise<OffenderSummary[]> {
    const caseAdminCaseload = await this.restClient.get<_OffenderSummary[]>({
      path: `/prison/${prisonCode}/case-admin/caseload`,
    })
    return caseAdminCaseload.map(c => {
      return {
        ...c,
        hdced: parseIsoDate(c.hdced),
        postponementDate: parseIsoDate(c.postponementDate),
        taskOverdueOn: parseIsoDate(c.taskOverdueOn),
      }
    })
  }

  async getAssessmentOverviewSummary(prisonNumber: string): Promise<AssessmentOverviewSummary> {
    const assessmentOverviewSummary = await this.restClient.get<_AssessmentOverviewSummary>({
      path: `/offender/${prisonNumber}/current-assessment`,
    })
    return {
      ...assessmentOverviewSummary,
      dateOfBirth: parseIsoDate(assessmentOverviewSummary.dateOfBirth),
      hdced: parseIsoDate(assessmentOverviewSummary.hdced),
      crd: parseIsoDate(assessmentOverviewSummary.crd),
      toDoEligibilityAndSuitabilityBy: parseIsoDate(assessmentOverviewSummary.toDoEligibilityAndSuitabilityBy),
    }
  }

  async getEligibilityCriteriaView(prisonNumber: string): Promise<EligibilityAndSuitabilityCaseView> {
    const initialChecks = await this.restClient.get<_EligibilityAndSuitabilityCaseView>({
      path: `/offender/${prisonNumber}/current-assessment/eligibility-and-suitability`,
    })
    return {
      ...initialChecks,
      assessmentSummary: {
        ...initialChecks.assessmentSummary,
        dateOfBirth: parseIsoDate(initialChecks.assessmentSummary.dateOfBirth),
        hdced: parseIsoDate(initialChecks.assessmentSummary.hdced),
        crd: parseIsoDate(initialChecks.assessmentSummary.crd),
      },
    }
  }

  async getEligibilityCriterionView(prisonNumber: string, code: string): Promise<EligibilityCriterionView> {
    const check = await this.restClient.get<_EligibilityCriterionView>({
      path: `/offender/${prisonNumber}/current-assessment/eligibility/${code}`,
    })
    return {
      ...check,
      assessmentSummary: {
        ...check.assessmentSummary,
        dateOfBirth: parseIsoDate(check.assessmentSummary.dateOfBirth),
        hdced: parseIsoDate(check.assessmentSummary.hdced),
        crd: parseIsoDate(check.assessmentSummary.crd),
      },
    }
  }

  async getSuitabilityCriterionView(prisonNumber: string, code: string): Promise<SuitabilityCriterionView> {
    const check = await this.restClient.get<_SuitabilityCriterionView>({
      path: `/offender/${prisonNumber}/current-assessment/suitability/${code}`,
    })
    return {
      ...check,
      assessmentSummary: {
        ...check.assessmentSummary,
        dateOfBirth: parseIsoDate(check.assessmentSummary.dateOfBirth),
        hdced: parseIsoDate(check.assessmentSummary.hdced),
        crd: parseIsoDate(check.assessmentSummary.crd),
      },
    }
  }

  async optOut(prisonNumber: string, optOutRequest: OptOutRequest): Promise<void> {
    return this.restClient.put({ path: `/offender/${prisonNumber}/current-assessment/opt-out`, data: optOutRequest })
  }

  async submitAnswer(prisonNumber: string, answer: CriterionCheck): Promise<EligibilityAndSuitabilityCaseView> {
    return this.restClient.put({
      path: `/offender/${prisonNumber}/current-assessment/eligibility-and-suitability-check`,
      data: answer,
    })
  }

  async findAddressesForPostcode(postcode: string): Promise<AddressSummary[]> {
    const addressSummaries = await this.restClient.get<_AddressSummary[]>({
      path: `/addresses?postcode=${postcode}`,
    })
    return addressSummaries.map(addressSummary => {
      return { ...addressSummary, addressLastUpdated: parseIsoDate(addressSummary.addressLastUpdated) }
    })
  }

  async getAddressForUprn(uprn: string): Promise<AddressSummary> {
    const addressSummary = await this.restClient.get<_AddressSummary>({
      path: `/address/uprn/${uprn}`,
    })
    return { ...addressSummary, addressLastUpdated: parseIsoDate(addressSummary.addressLastUpdated) }
  }

  async addStandardAddressCheckRequest(
    prisonNumber: string,
    addStandardAddressCheckRequest: AddStandardAddressCheckRequest,
  ): Promise<StandardAddressCheckRequestSummary> {
    const requestSummary = (await this.restClient.post<_StandardAddressCheckRequestSummary>({
      path: `/offender/${prisonNumber}/current-assessment/standard-address-check-request`,
      data: addStandardAddressCheckRequest,
    })) as _StandardAddressCheckRequestSummary
    return {
      ...requestSummary,
      dateRequested: parseIsoDate(requestSummary.dateRequested),
      address: {
        ...requestSummary.address,
        addressLastUpdated: parseIsoDate(requestSummary.address.addressLastUpdated),
      },
    }
  }

  async getStandardAddressCheckRequest(
    prisonNumber: string,
    requestId: number,
  ): Promise<StandardAddressCheckRequestSummary> {
    const requestSummary = await this.restClient.get<_StandardAddressCheckRequestSummary>({
      path: `/offender/${prisonNumber}/current-assessment/standard-address-check-request/${requestId}`,
    })
    return {
      ...requestSummary,
      dateRequested: parseIsoDate(requestSummary.dateRequested),
      address: {
        ...requestSummary.address,
        addressLastUpdated: parseIsoDate(requestSummary.address.addressLastUpdated),
      },
    }
  }

  async deleteAddressCheckRequest(prisonNumber: string, requestId: number): Promise<void> {
    return this.restClient.delete({
      path: `/offender/${prisonNumber}/current-assessment/address-request/${requestId}`,
    })
  }

  async getCheckRequestsForAssessment(prisonNumber: string): Promise<CheckRequestSummary[]> {
    const requestSummary = await this.restClient.get<_CheckRequestSummary[]>({
      path: `/offender/${prisonNumber}/current-assessment/address-check-requests`,
    })

    return requestSummary.map(c => {
      return {
        ...c,
        dateRequested: parseIsoDate(c.dateRequested),
        address: {
          ...c.address,
          addressLastUpdated: parseIsoDate(c.address.addressLastUpdated),
        },
      }
    })
  }

  async submitAssessmentForAddressChecks(prisonNumber: string, agent: Agent): Promise<void> {
    return this.restClient.put({
      path: `/offender/${prisonNumber}/current-assessment/submit-for-address-checks`,
      data: agent,
    })
  }

  async submitAssessmentForPreDecisionChecks(prisonNumber: string, agent: Agent): Promise<void> {
    return this.restClient.put({
      path: `/offender/${prisonNumber}/current-assessment/submit-for-pre-decision-checks`,
      data: agent,
    })
  }

  async addResidents(
    prisonNumber: string,
    addressCheckRequestId: number,
    addResidentRequest: AddResidentRequest[],
  ): Promise<ResidentSummary[]> {
    const residentsSummary = (await this.restClient.post<_ResidentSummary[]>({
      path: `/offender/${prisonNumber}/current-assessment/standard-address-check-request/${addressCheckRequestId}/resident`,
      data: addResidentRequest,
    })) as _ResidentSummary[]

    return residentsSummary.map(r => {
      return { ...r, dateOfBirth: parseIsoDate(r.dateOfBirth) }
    })
  }

  async getStaffDetailsByUsername(username: string) {
    return this.restClient.get<DeliusStaff>({ path: `/staff?username=${username}` })
  }

  async getPrisonUserDetails(username: string): Promise<PrisonUserDetails> {
    return this.restClient.get<PrisonUserDetails>({ path: `/staff/prison/${username}` })
  }

  async getCommunityOffenderManagerCaseload(staffCode: string): Promise<OffenderSummary[]> {
    const caseAdminCaseload = await this.restClient.get<_OffenderSummary[]>({
      path: `/probation/community-offender-manager/staff-code/${staffCode}/caseload`,
    })
    return caseAdminCaseload.map(c => {
      return {
        ...c,
        hdced: parseIsoDate(c.hdced),
        postponementDate: parseIsoDate(c.postponementDate),
        taskOverdueOn: parseIsoDate(c.taskOverdueOn),
      }
    })
  }

  async getResidentialChecksView(prisonNumber: string, addressCheckRequestId: number): Promise<ResidentialChecksView> {
    return this.restClient.get<ResidentialChecksView>({
      path: `/offender/${prisonNumber}/current-assessment/address-request/${addressCheckRequestId}/residential-checks`,
    })
  }

  async getResidentialChecksTask(
    prisonNumber: string,
    addressCheckRequestId: number,
    taskCode: string,
  ): Promise<ResidentialChecksTaskView> {
    const task = await this.restClient.get<_ResidentialChecksTaskView>({
      path: `/offender/${prisonNumber}/current-assessment/address-request/${addressCheckRequestId}/residential-checks/tasks/${taskCode}`,
    })

    return {
      ...task,
      assessmentSummary: {
        ...task.assessmentSummary,
        dateOfBirth: parseIsoDate(task.assessmentSummary.dateOfBirth),
        hdced: parseIsoDate(task.assessmentSummary.hdced),
        crd: parseIsoDate(task.assessmentSummary.crd),
      },
    }
  }

  async saveResidentialChecksTaskAnswers(
    prisonNumber: string,
    addressCheckRequestId: number,
    answersRequest: SaveResidentialChecksTaskAnswersRequest,
  ): Promise<ResidentialChecksTaskAnswersSummary> {
    return this.restClient.post<ResidentialChecksTaskAnswersSummary>({
      path: `/offender/${prisonNumber}/current-assessment/address-request/${addressCheckRequestId}/residential-checks/answers`,
      data: answersRequest,
    })
  }

  async updateCaseAdminAdditionalInformation(
    prisonNumber: string,
    requestId: number,
    updateCaseAdminAdditionInfoRequest: UpdateCaseAdminAdditionInfoRequest,
  ): Promise<void> {
    return this.restClient.put({
      path: `/offender/${prisonNumber}/current-assessment/address-request/${requestId}/case-admin-additional-information`,
      data: updateCaseAdminAdditionInfoRequest,
    })
  }

  async getDecisionMakerCaseload(prisonCode: string): Promise<OffenderSummary[]> {
    const decisionMakerCaseload = await this.restClient.get<_OffenderSummary[]>({
      path: `/prison/${prisonCode}/decision-maker/caseload`,
    })
    return decisionMakerCaseload.map(c => {
      return {
        ...c,
        hdced: parseIsoDate(c.hdced),
        postponementDate: parseIsoDate(c.postponementDate),
        taskOverdueOn: parseIsoDate(c.taskOverdueOn),
      }
    })
  }

  async getForm(prisonNumber: string, documentSubjectType: DocumentSubjectType): Promise<Buffer> {
    return this.restClient.get<Buffer>({
      path: `/offender/${prisonNumber}/document/${documentSubjectType}`,
      responseType: 'arraybuffer',
    })
  }
}
