import { AuthenticationClient, RestClient } from '@ministryofjustice/hmpps-rest-client'
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
import { parseIsoDate } from '../utils/utils'
import logger from '../../logger'

export default class AssessForEarlyReleaseApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('assessForEarlyReleaseApi', config.apis.assessForEarlyReleaseApi as ApiConfig, logger, authenticationClient)
  }

  async getCaseAdminCaseload(token: string, agent: Agent, prisonCode: string): Promise<OffenderSummary[]> {
    const caseAdminCaseload = await this.getWithToken<_OffenderSummary[]>(
      `/prison/${prisonCode}/case-admin/caseload`,
      token,
      agent,
    )

    return caseAdminCaseload.map(c => {
      return {
        ...c,
        hdced: parseIsoDate(c.hdced),
        postponementDate: parseIsoDate(c.postponementDate),
        taskOverdueOn: parseIsoDate(c.taskOverdueOn),
      }
    })
  }

  async getAssessmentOverviewSummary(
    token: string,
    agent: Agent,
    prisonNumber: string,
  ): Promise<AssessmentOverviewSummary> {
    const assessmentOverviewSummary = await this.getWithToken<_AssessmentOverviewSummary>(
      `/offender/${prisonNumber}/current-assessment`,
      token,
      agent,
    )

    return {
      ...assessmentOverviewSummary,
      dateOfBirth: parseIsoDate(assessmentOverviewSummary.dateOfBirth),
      hdced: parseIsoDate(assessmentOverviewSummary.hdced),
      crd: parseIsoDate(assessmentOverviewSummary.crd),
      toDoEligibilityAndSuitabilityBy: parseIsoDate(assessmentOverviewSummary.toDoEligibilityAndSuitabilityBy),
    }
  }

  async getEligibilityCriteriaView(
    token: string,
    agent: Agent,
    prisonNumber: string,
  ): Promise<EligibilityAndSuitabilityCaseView> {
    const initialChecks = await this.getWithToken<_EligibilityAndSuitabilityCaseView>(
      `/offender/${prisonNumber}/current-assessment/eligibility-and-suitability`,
      token,
      agent,
    )

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

  async getEligibilityCriterionView(
    token: string,
    agent: Agent,
    prisonNumber: string,
    code: string,
  ): Promise<EligibilityCriterionView> {
    const check = await this.getWithToken<_EligibilityCriterionView>(
      `/offender/${prisonNumber}/current-assessment/eligibility/${code}`,
      token,
      agent,
    )

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

  async getSuitabilityCriterionView(
    token: string,
    agent: Agent,
    prisonNumber: string,
    code: string,
  ): Promise<SuitabilityCriterionView> {
    const check = await this.getWithToken<_SuitabilityCriterionView>(
      `/offender/${prisonNumber}/current-assessment/suitability/${code}`,
      token,
      agent,
    )
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

  async optOut(token: string, agent: Agent, prisonNumber: string, optOutRequest: OptOutRequest): Promise<void> {
    return this.putWithToken(`/offender/${prisonNumber}/current-assessment/opt-out`, token, agent, optOutRequest)
  }

  async submitAnswer(
    token: string,
    agent: Agent,
    prisonNumber: string,
    answer: CriterionCheck,
  ): Promise<EligibilityAndSuitabilityCaseView> {
    return this.putWithToken(
      `/offender/${prisonNumber}/current-assessment/eligibility-and-suitability-check`,
      token,
      agent,
      answer,
    )
  }

  async findAddressesForPostcode(token: string, agent: Agent, postcode: string): Promise<AddressSummary[]> {
    const addressSummaries = await this.getWithToken<_AddressSummary[]>(`/addresses?postcode=${postcode}`, token, agent)
    return addressSummaries.map(addressSummary => {
      return { ...addressSummary, addressLastUpdated: parseIsoDate(addressSummary.addressLastUpdated) }
    })
  }

  async getAddressForUprn(token: string, agent: Agent, uprn: string): Promise<AddressSummary> {
    const addressSummary = await this.getWithToken<_AddressSummary>(`/address/uprn/${uprn}`, token, agent)
    return { ...addressSummary, addressLastUpdated: parseIsoDate(addressSummary.addressLastUpdated) }
  }

  async addStandardAddressCheckRequest(
    token: string,
    agent: Agent,
    prisonNumber: string,
    addStandardAddressCheckRequest: AddStandardAddressCheckRequest,
  ): Promise<StandardAddressCheckRequestSummary> {
    const requestSummary = await this.postWithToken<_StandardAddressCheckRequestSummary>(
      `/offender/${prisonNumber}/current-assessment/standard-address-check-request`,
      token,
      agent,
      addStandardAddressCheckRequest,
    )
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
    token: string,
    agent: Agent,
    prisonNumber: string,
    requestId: number,
  ): Promise<StandardAddressCheckRequestSummary> {
    const requestSummary = await this.getWithToken<_StandardAddressCheckRequestSummary>(
      `/offender/${prisonNumber}/current-assessment/standard-address-check-request/${requestId}`,
      token,
      agent,
    )
    return {
      ...requestSummary,
      dateRequested: parseIsoDate(requestSummary.dateRequested),
      address: {
        ...requestSummary.address,
        addressLastUpdated: parseIsoDate(requestSummary.address.addressLastUpdated),
      },
    }
  }

  async deleteAddressCheckRequest(token: string, agent: Agent, prisonNumber: string, requestId: number): Promise<void> {
    return this.deleteWithToken(
      `/offender/${prisonNumber}/current-assessment/address-request/${requestId}`,
      token,
      agent,
    )
  }

  async getCheckRequestsForAssessment(
    token: string,
    agent: Agent,
    prisonNumber: string,
  ): Promise<CheckRequestSummary[]> {
    const requestSummary = await this.getWithToken<_CheckRequestSummary[]>(
      `/offender/${prisonNumber}/current-assessment/address-check-requests`,
      token,
      agent,
    )

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

  async submitAssessmentForAddressChecks(token: string, agent: Agent, prisonNumber: string): Promise<void> {
    return this.putWithToken(
      `/offender/${prisonNumber}/current-assessment/submit-for-address-checks`,
      token,
      agent,
      agent,
    )
  }

  async submitAssessmentForPreDecisionChecks(token: string, agent: Agent, prisonNumber: string): Promise<void> {
    return this.putWithToken(
      `/offender/${prisonNumber}/current-assessment/submit-for-pre-decision-checks`,
      token,
      agent,
      agent,
    )
  }

  async addResidents(
    token: string,
    agent: Agent,
    prisonNumber: string,
    addressCheckRequestId: number,
    addResidentRequest: AddResidentRequest[],
  ): Promise<ResidentSummary[]> {
    const residentsSummary = await this.postWithToken<_ResidentSummary[]>(
      `/offender/${prisonNumber}/current-assessment/standard-address-check-request/${addressCheckRequestId}/resident`,
      token,
      agent,
      addResidentRequest,
    )

    return residentsSummary.map(r => {
      return { ...r, dateOfBirth: parseIsoDate(r.dateOfBirth) }
    })
  }

  async getStaffDetailsByUsername(token: string, agent: Agent, username: string) {
    return this.getWithToken<DeliusStaff>(`/staff?username=${username}`, token, agent)
  }

  async getPrisonUserDetails(token: string, agent: Agent, username: string): Promise<PrisonUserDetails> {
    return this.getWithToken<PrisonUserDetails>(`/staff/prison/${username}`, token, agent)
  }

  async getCommunityOffenderManagerCaseload(
    token: string,
    agent: Agent,
    staffCode: string,
  ): Promise<OffenderSummary[]> {
    const caseAdminCaseload = await this.getWithToken<_OffenderSummary[]>(
      `/probation/community-offender-manager/staff-code/${staffCode}/caseload`,
      token,
      agent,
    )
    return caseAdminCaseload.map(c => {
      return {
        ...c,
        hdced: parseIsoDate(c.hdced),
        postponementDate: parseIsoDate(c.postponementDate),
        taskOverdueOn: parseIsoDate(c.taskOverdueOn),
      }
    })
  }

  async getResidentialChecksView(
    token: string,
    agent: Agent,
    prisonNumber: string,
    addressCheckRequestId: number,
  ): Promise<ResidentialChecksView> {
    return this.getWithToken<ResidentialChecksView>(
      `/offender/${prisonNumber}/current-assessment/address-request/${addressCheckRequestId}/residential-checks`,
      token,
      agent,
    )
  }

  async getResidentialChecksTask(
    token: string,
    agent: Agent,
    prisonNumber: string,
    addressCheckRequestId: number,
    taskCode: string,
  ): Promise<ResidentialChecksTaskView> {
    const task = await this.getWithToken<_ResidentialChecksTaskView>(
      `/offender/${prisonNumber}/current-assessment/address-request/${addressCheckRequestId}/residential-checks/tasks/${taskCode}`,
      token,
      agent,
    )

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
    token: string,
    agent: Agent,
    prisonNumber: string,
    addressCheckRequestId: number,
    answersRequest: SaveResidentialChecksTaskAnswersRequest,
  ): Promise<ResidentialChecksTaskAnswersSummary> {
    return this.postWithToken<ResidentialChecksTaskAnswersSummary>(
      `/offender/${prisonNumber}/current-assessment/address-request/${addressCheckRequestId}/residential-checks/answers`,
      token,
      agent,
      answersRequest,
    )
  }

  async updateCaseAdminAdditionalInformation(
    token: string,
    agent: Agent,
    prisonNumber: string,
    requestId: number,
    updateCaseAdminAdditionInfoRequest: UpdateCaseAdminAdditionInfoRequest,
  ): Promise<void> {
    return this.putWithToken(
      `/offender/${prisonNumber}/current-assessment/address-request/${requestId}/case-admin-additional-information`,
      token,
      agent,
      updateCaseAdminAdditionInfoRequest,
    )
  }

  async getDecisionMakerCaseload(token: string, agent: Agent, prisonCode: string): Promise<OffenderSummary[]> {
    const decisionMakerCaseload = await this.getWithToken<_OffenderSummary[]>(
      `/prison/${prisonCode}/decision-maker/caseload`,
      token,
      agent,
    )
    return decisionMakerCaseload.map(c => {
      return {
        ...c,
        hdced: parseIsoDate(c.hdced),
        postponementDate: parseIsoDate(c.postponementDate),
        taskOverdueOn: parseIsoDate(c.taskOverdueOn),
      }
    })
  }

  async getForm(
    token: string,
    agent: Agent,
    prisonNumber: string,
    documentSubjectType: DocumentSubjectType,
  ): Promise<Buffer> {
    return this.getWithToken<Buffer>(
      `/offender/${prisonNumber}/document/${documentSubjectType}`,
      token,
      agent,
      'arraybuffer',
    )
  }

  private getDefaultHeaders(agent: Agent) {
    return {
      username: agent?.username,
      fullName: agent?.fullName,
      role: agent?.role,
      onBehalfOf: agent?.onBehalfOf,
    }
  }

  private getWithToken<T>(path: string, token: string, agent: Agent, responseType = ''): Promise<T> {
    return this.get<T>(
      {
        path,
        headers: this.getDefaultHeaders(agent),
        responseType,
      },
      token,
    )
  }

  private putWithToken<T>(
    path: string,
    token: string,
    agent: Agent,
    payload: Record<string, unknown> | string,
  ): Promise<T> {
    return this.put<T>(
      {
        path,
        headers: this.getDefaultHeaders(agent),
        data: payload,
      },
      token,
    )
  }

  private postWithToken<T>(
    path: string,
    token: string,
    agent: Agent,
    payload: Record<string, unknown> | string | unknown[],
  ): Promise<T> {
    return this.post<T>(
      {
        path,
        headers: this.getDefaultHeaders(agent),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: payload as any,
      },
      token,
    )
  }

  private deleteWithToken<T>(path: string, token: string, agent: Agent): Promise<T> {
    return this.delete<T>(
      {
        path,
        headers: this.getDefaultHeaders(agent),
      },
      token,
    )
  }
}
