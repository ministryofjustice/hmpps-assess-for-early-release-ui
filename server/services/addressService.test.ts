import AddressService from './addressService'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { AddressSummary } from '../@types/assessForEarlyReleaseApiClientTypes'
import {
  createAddResidentRequest,
  createAddressSummary,
  createAddStandardAddressCheckRequest,
  createResidentSummary,
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
        xcoordinate: 472219.0,
        ycoordinate: 170067.0,
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
        xcoordinate: 472274.0,
        ycoordinate: 170113.0,
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

  it('Gets a standard address check request', async () => {
    const prisonNumber = 'A1234AE'
    const requestId = 49

    const requestSummary = createStandardAddressCheckRequestSummary()
    assessForEarlyReleaseApiClient.getStandardAddressCheckRequest.mockResolvedValue(requestSummary)

    const result = await addressService.getStandardAddressCheckRequest(token, prisonNumber, requestId)

    expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
    expect(result).toEqual(requestSummary)
  })

  it('Adds a resident', async () => {
    const prisonNumber = 'A1234AE'
    const requestId = 49

    const addResidentRequest = createAddResidentRequest()
    const residentSummary = createResidentSummary()
    assessForEarlyReleaseApiClient.addResident.mockResolvedValue(residentSummary)

    const result = await addressService.addResident(token, prisonNumber, requestId, addResidentRequest)

    expect(AssessForEarlyReleaseApiClientBuilder).toHaveBeenCalledWith(token)
    expect(result).toEqual(residentSummary)
  })
})
