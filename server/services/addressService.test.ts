import AddressService from './addressService'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { AddressSummary } from '../@types/assessForEarlyReleaseApiClientTypes'
import {
  createAddressSummary,
  createAddStandardAddressCheckRequest,
  createStandardAddressCheckRequestSummary,
} from '../data/__testutils/testObjects'

const AssessForEarlyReleaseApiClientBuilder = jest.fn()
const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'

describe('Address Service', () => {
  let addressService: AddressService

  beforeEach(() => {
    AssessForEarlyReleaseApiClientBuilder.mockReturnValue(assessForEarlyReleaseApiClient)
    addressService = new AddressService(AssessForEarlyReleaseApiClientBuilder)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Get addresses by post code', async () => {
    const postcode = 'RG11QA'
    const addressSummaries = [
      createAddressSummary({
        uprn: '310010433',
        firstLine: '97, HARTLAND ROAD',
        secondLine: '',
        town: 'READING',
        county: 'READING',
        postcode: 'RG2 8AF',
        country: 'England',
        xCoordinate: 472219.0,
        yCoordinate: 170067.0,
        addressLastUpdated: new Date('2020-06-25'),
      }),
      createAddressSummary({}),
      createAddressSummary({
        uprn: '310068688',
        firstLine: 'JOHN MADEJSKI ACADEMY, 125, HARTLAND ROAD',
        secondLine: '',
        town: 'READING',
        county: 'READING',
        postcode: 'RG2 8AF',
        country: 'England',
        xCoordinate: 472274.0,
        yCoordinate: 170113.0,
        addressLastUpdated: new Date('2019-08-15'),
      }),
    ] as AddressSummary[]
    assessForEarlyReleaseApiClient.findAddressesForPostcode.mockResolvedValue(addressSummaries)

    const result = await addressService.findAddressesForPostcode(token, postcode)

    expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
    expect(result).toEqual(addressSummaries)
  })

  it('Get address for UPRN', async () => {
    const addressSummary = createAddressSummary({})
    assessForEarlyReleaseApiClient.getAddressForUprn.mockResolvedValue(addressSummary)

    const result = await addressService.getAddressForUprn(token, addressSummary.uprn)

    expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
    expect(result).toEqual(addressSummary)
  })

  it('Add standard address check request', async () => {
    const prisonNumber = 'A1234AE'
    const standardAddressCheckRequest = createAddStandardAddressCheckRequest({})

    const requestSummary = createStandardAddressCheckRequestSummary()
    assessForEarlyReleaseApiClient.addStandardAddressCheckRequest.mockResolvedValue(requestSummary)

    const result = await addressService.addStandardAddressCheckRequest(token, prisonNumber, standardAddressCheckRequest)

    expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
    expect(result).toEqual(requestSummary)
  })
})
