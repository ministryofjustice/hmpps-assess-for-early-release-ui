import type {
  _AddressSummary,
  _AssessmentSummary,
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
  CriterionCheck,
  EligibilityAndSuitabilityCaseView,
  EligibilityCriterionView,
  OffenderSummary,
  OptOutRequest,
  ResidentSummary,
  StandardAddressCheckRequestSummary,
  SuitabilityCriterionView,
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
      standardAddressCheckRequest: {
        ...residentSummary.standardAddressCheckRequest,
        dateRequested: parseIsoDate(residentSummary.standardAddressCheckRequest.dateRequested),
        address: {
          ...residentSummary.standardAddressCheckRequest.address,
          addressLastUpdated: parseIsoDate(residentSummary.standardAddressCheckRequest.address.addressLastUpdated),
        },
      },
    }
  }
}
