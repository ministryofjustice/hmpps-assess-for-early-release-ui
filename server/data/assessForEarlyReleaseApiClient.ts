import type {
  _AddressSummary,
  _AssessmentSummary,
  _CheckRequestSummary,
  _EligibilityAndSuitabilityCaseView,
  _EligibilityCriterionView,
  _OffenderSummary,
  _ResidentSummary,
  _StandardAddressCheckRequestSummary,
  _SuitabilityCriterionView,
  AddResidentRequest,
  AddressSummary,
  AddStandardAddressCheckRequest,
  AssessmentSummary,
  CheckRequestSummary,
  CriterionCheck,
  DeliusStaff,
  EligibilityAndSuitabilityCaseView,
  EligibilityCriterionView,
  OffenderSummary,
  OptOutRequest,
  ResidentialChecksTaskView,
  ResidentialChecksView,
  ResidentSummary,
  StandardAddressCheckRequestSummary,
  SuitabilityCriterionView,
  UpdateCaseAdminAdditionInfoRequest,
} from '../@types/assessForEarlyReleaseApiClientTypes'
import config, { ApiConfig } from '../config'
import RestClient from './restClient'
import { parseIsoDate } from '../utils/utils'

export default class AssessForEarlyReleaseApiClient {
  private restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient(
      'assessForEarlyReleaseApi',
      config.apis.assessForEarlyReleaseApi as ApiConfig,
      token,
    )
  }

  async getCaseAdminCaseload(prisonCode: string): Promise<OffenderSummary[]> {
    const caseAdminCaseload = await this.restClient.get<_OffenderSummary[]>({
      path: `/prison/${prisonCode}/case-admin/caseload`,
    })
    return caseAdminCaseload.map(c => {
      return { ...c, hdced: parseIsoDate(c.hdced) }
    })
  }

  async getAssessmentSummary(prisonNumber: string): Promise<AssessmentSummary> {
    const assessmentSummary = await this.restClient.get<_AssessmentSummary>({
      path: `/offender/${prisonNumber}/current-assessment`,
    })
    return {
      ...assessmentSummary,
      dateOfBirth: parseIsoDate(assessmentSummary.dateOfBirth),
      hdced: parseIsoDate(assessmentSummary.hdced),
      crd: parseIsoDate(assessmentSummary.crd),
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

  async submitAnswer(prisonNumber: string, answer: CriterionCheck): Promise<void> {
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
    standardAddressCheckRequest: AddStandardAddressCheckRequest,
  ): Promise<StandardAddressCheckRequestSummary> {
    const requestSummary = (await this.restClient.post<_StandardAddressCheckRequestSummary>({
      path: `/offender/${prisonNumber}/current-assessment/standard-address-check-request`,
      data: standardAddressCheckRequest,
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

  async submitAssessmentForAddressChecks(prisonNumber: string): Promise<void> {
    return this.restClient.put({ path: `/offender/${prisonNumber}/current-assessment/submit-for-address-checks` })
  }

  async addResident(
    prisonNumber: string,
    addressCheckRequestId: number,
    addResidentRequest: AddResidentRequest,
  ): Promise<ResidentSummary> {
    const residentSummary = (await this.restClient.post<_ResidentSummary>({
      path: `/offender/${prisonNumber}/current-assessment/standard-address-check-request/${addressCheckRequestId}/resident`,
      data: addResidentRequest,
    })) as _ResidentSummary
    return {
      ...residentSummary,
      dateOfBirth: parseIsoDate(residentSummary.dateOfBirth),
    }
  }

  async getStaffDetailsByUsername(username: string) {
    return this.restClient.get<DeliusStaff>({ path: `/staff?username=${username}` })
  }

  async getCommunityOffenderManagerCaseload(staffCode: string): Promise<OffenderSummary[]> {
    const caseAdminCaseload = await this.restClient.get<_OffenderSummary[]>({
      path: `/probation/community-offender-manager/staff-code/${staffCode}/caseload`,
    })
    return caseAdminCaseload.map(c => {
      return { ...c, hdced: parseIsoDate(c.hdced) }
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
    return this.restClient.get<ResidentialChecksTaskView>({
      path: `/offender/${prisonNumber}/current-assessment/address-request/${addressCheckRequestId}/residential-checks/tasks/${taskCode}`,

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
}
