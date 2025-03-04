import { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import type {
  AddResidentsRequestWrapper,
  AddressSummary,
  AddStandardAddressCheckRequestWrapper,
  Agent,
  CheckRequestSummary,
  StandardAddressCheckRequestSummary,
  UpdateCaseAdminAdditionInfoRequestWrapper,
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
    addStandardAddressCheckRequestWrapper: AddStandardAddressCheckRequestWrapper,
  ): Promise<StandardAddressCheckRequestSummary> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.addStandardAddressCheckRequest(
      prisonNumber,
      addStandardAddressCheckRequestWrapper,
    )
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

  public async submitAssessmentForAddressChecks(token: string, prisonNumber: string, agent: Agent): Promise<void> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.submitAssessmentForAddressChecks(prisonNumber, agent)
  }

  public async submitAssessmentForPreDecisionChecks(token: string, prisonNumber: string, agent: Agent): Promise<void> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.submitAssessmentForPreDecisionChecks(prisonNumber, agent)
  }

  public async addResidents(
    token: string,
    prisonNumber: string,
    addressCheckRequestId: number,
    addResidentsRequestWrapper: AddResidentsRequestWrapper,
  ) {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.addResidents(prisonNumber, addressCheckRequestId, addResidentsRequestWrapper)
  }

  public async updateCaseAdminAdditionalInformation(
    token: string,
    prisonNumber: string,
    addressCheckRequestId: number,
    updateCaseAdminAdditionInfoRequestWrapper: UpdateCaseAdminAdditionInfoRequestWrapper,
  ) {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.updateCaseAdminAdditionalInformation(
      prisonNumber,
      addressCheckRequestId,
      updateCaseAdminAdditionInfoRequestWrapper,
    )
  }
}
