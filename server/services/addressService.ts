import { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import type {
  AddResidentRequest,
  AddressSummary,
  AddStandardAddressCheckRequest,
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
  ) {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.addStandardAddressCheckRequest(prisonNumber, addStandardAddressCheckRequest)
  }

  public async getStandardAddressCheckRequest(token: string, prisonNumber: string, requestId: number) {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.getStandardAddressCheckRequest(prisonNumber, requestId)
  }

  public async deleteAddressCheckRequest(token: string, prisonNumber: string, requestId: number) {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.deleteAddressCheckRequest(prisonNumber, requestId)
  }

  public async getCheckRequestsForAssessment(token: string, prisonNumber: string) {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.getCheckRequestsForAssessment(prisonNumber)
  }

  public async addResident(
    token: string,
    prisonNumber: string,
    addressCheckRequestId: number,
    addResidentRequest: AddResidentRequest,
  ) {
    const assessForEarlyReleaseApiClient = this.assessForEarlyReleaseApiClientBuilder(token)
    return assessForEarlyReleaseApiClient.addResident(prisonNumber, addressCheckRequestId, addResidentRequest)
  }
}
