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
  constructor(private readonly assessForEarlyReleaseApiClient: AssessForEarlyReleaseApiClient) {}

  public async findAddressesForPostcode(token: string, agent: Agent, postcode: string): Promise<AddressSummary[]> {
    return this.assessForEarlyReleaseApiClient.findAddressesForPostcode(token, agent, postcode)
  }

  public async getAddressForUprn(token: string, agent: Agent, uprn: string): Promise<AddressSummary> {
    return this.assessForEarlyReleaseApiClient.getAddressForUprn(token, agent, uprn)
  }

  public async addStandardAddressCheckRequest(
    token: string,
    agent: Agent,
    prisonNumber: string,
    addStandardAddressCheckRequest: AddStandardAddressCheckRequest,
  ): Promise<StandardAddressCheckRequestSummary> {
    return this.assessForEarlyReleaseApiClient.addStandardAddressCheckRequest(
      token,
      agent,
      prisonNumber,
      addStandardAddressCheckRequest,
    )
  }

  public async getStandardAddressCheckRequest(
    token: string,
    agent: Agent,
    prisonNumber: string,
    requestId: number,
  ): Promise<StandardAddressCheckRequestSummary> {
    return this.assessForEarlyReleaseApiClient.getStandardAddressCheckRequest(token, agent, prisonNumber, requestId)
  }

  public async deleteAddressCheckRequest(
    token: string,
    agent: Agent,
    prisonNumber: string,
    requestId: number,
  ): Promise<void> {
    return this.assessForEarlyReleaseApiClient.deleteAddressCheckRequest(token, agent, prisonNumber, requestId)
  }

  public async getCheckRequestsForAssessment(
    token: string,
    agent: Agent,
    prisonNumber: string,
  ): Promise<CheckRequestSummary[]> {
    return this.assessForEarlyReleaseApiClient.getCheckRequestsForAssessment(token, agent, prisonNumber)
  }

  public async submitAssessmentForAddressChecks(token: string, agent: Agent, prisonNumber: string): Promise<void> {
    return this.assessForEarlyReleaseApiClient.submitAssessmentForAddressChecks(token, agent, prisonNumber)
  }

  public async submitAssessmentForPreDecisionChecks(token: string, agent: Agent, prisonNumber: string): Promise<void> {
    return this.assessForEarlyReleaseApiClient.submitAssessmentForPreDecisionChecks(token, agent, prisonNumber)
  }

  public async addResidents(
    token: string,
    agent: Agent,
    prisonNumber: string,
    addressCheckRequestId: number,
    addResidentRequest: AddResidentRequest[],
  ) {
    return this.assessForEarlyReleaseApiClient.addResidents(
      token,
      agent,
      prisonNumber,
      addressCheckRequestId,
      addResidentRequest,
    )
  }

  public async updateCaseAdminAdditionalInformation(
    token: string,
    agent: Agent,
    prisonNumber: string,
    addressCheckRequestId: number,
    updateCaseAdminAdditionInfoRequest: UpdateCaseAdminAdditionInfoRequest,
  ) {
    return this.assessForEarlyReleaseApiClient.updateCaseAdminAdditionalInformation(
      token,
      agent,
      prisonNumber,
      addressCheckRequestId,
      updateCaseAdminAdditionInfoRequest,
    )
  }
}
