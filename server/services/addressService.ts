import { RestClientBuilder } from '../data'
import AssessForEarlyReleaseApiClient from '../data/assessForEarlyReleaseApiClient'
import type { AddressSummary, AddStandardAddressCheckRequest } from '../@types/assessForEarlyReleaseApiClientTypes'

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
}
