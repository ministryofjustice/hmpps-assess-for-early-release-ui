import { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import type {
  AddResidentRequest,
  AddressSummary,
  AddStandardAddressCheckRequest,
  Agent,
  CheckRequestSummary,
  StandardAddressCheckRequestSummary,
  UpdateCaseAdminAdditionInfoRequest,
} from '../@types/assessForEarlyReleaseApiClientTypes'

export default class AddressService {
  constructor(
    private readonly assessForEarlyReleaseApiClientBuilder: RestClientBuilder<AssessForEarlyReleaseApiClient>,
  ) {}

  public async findAddressesForPostcode(token: string, agent: Agent, postcode: string): Promise<AddressSummary[]> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token, agent)
    return assessForEarlyReleaseApiClient.findAddressesForPostcode(postcode)
  }

  public async getAddressForUprn(token: string, agent: Agent, uprn: string): Promise<AddressSummary> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token, agent)
    return assessForEarlyReleaseApiClient.getAddressForUprn(uprn)
  }

  public async addStandardAddressCheckRequest(
    token: string,
    agent: Agent,
    prisonNumber: string,
    addStandardAddressCheckRequest: AddStandardAddressCheckRequest,
  ): Promise<StandardAddressCheckRequestSummary> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token, agent)
    return assessForEarlyReleaseApiClient.addStandardAddressCheckRequest(prisonNumber, addStandardAddressCheckRequest)
  }

  public async getStandardAddressCheckRequest(
    token: string,
    agent: Agent,
    prisonNumber: string,
    requestId: number,
  ): Promise<StandardAddressCheckRequestSummary> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token, agent)
    return assessForEarlyReleaseApiClient.getStandardAddressCheckRequest(prisonNumber, requestId)
  }

  public async deleteAddressCheckRequest(
    token: string,
    agent: Agent,
    prisonNumber: string,
    requestId: number,
  ): Promise<void> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token, agent)
    return assessForEarlyReleaseApiClient.deleteAddressCheckRequest(prisonNumber, requestId)
  }

  public async getCheckRequestsForAssessment(
    token: string,
    agent: Agent,
    prisonNumber: string,
  ): Promise<CheckRequestSummary[]> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token, agent)
    return assessForEarlyReleaseApiClient.getCheckRequestsForAssessment(prisonNumber)
  }

  public async submitAssessmentForAddressChecks(token: string, agent: Agent, prisonNumber: string): Promise<void> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token, agent)
    return assessForEarlyReleaseApiClient.submitAssessmentForAddressChecks(prisonNumber, agent)
  }

  public async submitAssessmentForPreDecisionChecks(token: string, agent: Agent, prisonNumber: string): Promise<void> {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token, agent)
    return assessForEarlyReleaseApiClient.submitAssessmentForPreDecisionChecks(prisonNumber, agent)
  }

  public async addResidents(
    token: string,
    agent: Agent,
    prisonNumber: string,
    addressCheckRequestId: number,
    addResidentRequest: AddResidentRequest[],
  ) {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token, agent)
    return assessForEarlyReleaseApiClient.addResidents(prisonNumber, addressCheckRequestId, addResidentRequest)
  }

  public async updateCaseAdminAdditionalInformation(
    token: string,
    agent: Agent,
    prisonNumber: string,
    addressCheckRequestId: number,
    updateCaseAdminAdditionInfoRequest: UpdateCaseAdminAdditionInfoRequest,
  ) {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token, agent)
    return assessForEarlyReleaseApiClient.updateCaseAdminAdditionalInformation(
      prisonNumber,
      addressCheckRequestId,
      updateCaseAdminAdditionInfoRequest,
    )
  }
}
