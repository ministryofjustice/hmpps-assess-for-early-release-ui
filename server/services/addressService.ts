import { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import type {
  AddResidentRequest,
  AddressSummary,
  AddStandardAddressCheckRequest,
  CheckRequestSummary,
  StandardAddressCheckRequestSummary,
  UpdateCaseAdminAdditionInfoRequest,
} from '../@types/assessForEarlyReleaseApiClientTypes'

export default class AddressService {
  constructor(
    private readonly assessForEarlyReleaseApiClientBuilder: RestClientBuilder<AssessForEarlyReleaseApiClient>,
  ) {}

  public async findAddressesForPostcode(token: string, postcode: string): Promise<AddressSummary[]> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.findAddressesForPostcode(postcode)
  }

  public async getAddressForUprn(token: string, uprn: string): Promise<AddressSummary> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.getAddressForUprn(uprn)
  }

  public async addStandardAddressCheckRequest(
    token: string,
    prisonNumber: string,
    addStandardAddressCheckRequest: AddStandardAddressCheckRequest,
  ): Promise<StandardAddressCheckRequestSummary> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.addStandardAddressCheckRequest(prisonNumber, addStandardAddressCheckRequest)
  }

  public async getStandardAddressCheckRequest(
    token: string,
    prisonNumber: string,
    requestId: number,
  ): Promise<StandardAddressCheckRequestSummary> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.getStandardAddressCheckRequest(prisonNumber, requestId)
  }

  public async deleteAddressCheckRequest(token: string, prisonNumber: string, requestId: number): Promise<void> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.deleteAddressCheckRequest(prisonNumber, requestId)
  }

  public async getCheckRequestsForAssessment(token: string, prisonNumber: string): Promise<CheckRequestSummary[]> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.getCheckRequestsForAssessment(prisonNumber)
  }

  public async submitAssessmentForAddressChecks(token: string, prisonNumber: string): Promise<void> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.submitAssessmentForAddressChecks(prisonNumber)
  }

  public async submitAssessmentForPreDecisionChecks(token: string, prisonNumber: string): Promise<void> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.submitAssessmentForPreDecisionChecks(prisonNumber)
  }

  public async addResidents(
    token: string,
    prisonNumber: string,
    addressCheckRequestId: number,
    addResidentsRequest: AddResidentRequest[],
  ) {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.addResidents(prisonNumber, addressCheckRequestId, addResidentsRequest)
  }

  public async updateCaseAdminAdditionalInformation(
    token: string,
    prisonNumber: string,
    addressCheckRequestId: number,
    updateCaseAdminAdditionInfoRequest: UpdateCaseAdminAdditionInfoRequest,
  ) {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.updateCaseAdminAdditionalInformation(
      prisonNumber,
      addressCheckRequestId,
      updateCaseAdminAdditionInfoRequest,
    )
  }
}
