import AddressService from './addressService'
import { createAssessForEarlyReleaseApiClient } from '../data/__testutils/mocks'
import { AddressSummary, Agent } from '../@types/assessForEarlyReleaseApiClientTypes'
import {
  createAddResidentRequest,
  createAddressSummary,
  createAddStandardAddressCheckRequest,
  createResidentSummary,
  createStandardAddressCheckRequestSummary,
  createAgent,
} from '../data/__testutils/testObjects'

const assessForEarlyReleaseApiClient = createAssessForEarlyReleaseApiClient()
const token = 'TOKEN-1'
const agent = createAgent() as Agent

describe('Address Service', () => {
  let addressService: AddressService

  beforeEach(() => {
    addressService = new AddressService(assessForEarlyReleaseApiClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Get addresses by post code', async () => {
    const postcode = 'RG11QA'
    const addressSummaries = [
      createAddressSummary({
        uprn: '310010433',
        firstLine: '1, TEST ROAD',
        secondLine: '',
        town: 'TEST TOWN',
        county: 'TEST COUNTY',
        postcode: 'TEST',
        country: 'England',
        xcoordinate: 472219.0,
        ycoordinate: 170067.0,
        addressLastUpdated: new Date('2020-06-25'),
      }),
      createAddressSummary({}),
      createAddressSummary({
        uprn: '310068688',
        firstLine: 'TEST PLACE, 2, TEST ROAD',
        secondLine: '',
        town: 'TEST TOWN',
        county: 'TEST COUNTY',
        postcode: 'TEST',
        country: 'England',
        xcoordinate: 472274.0,
        ycoordinate: 170113.0,
        addressLastUpdated: new Date('2019-08-15'),
      }),
    ] as AddressSummary[]
    assessForEarlyReleaseApiClient.searchForAddresses.mockResolvedValue(addressSummaries)

    const result = await addressService.searchForAddresses(token, agent, postcode)

    expect(result).toEqual(addressSummaries)
  })

  it('Get address for UPRN', async () => {
    const addressSummary = createAddressSummary({})
    assessForEarlyReleaseApiClient.getAddressForUprn.mockResolvedValue(addressSummary)

    const result = await addressService.getAddressForUprn(token, agent, addressSummary.uprn)

    expect(result).toEqual(addressSummary)
  })

  it('Add standard address check request', async () => {
    const prisonNumber = 'A1234AE'
    const standardAddressCheckRequest = createAddStandardAddressCheckRequest({})

    const requestSummary = createStandardAddressCheckRequestSummary()
    assessForEarlyReleaseApiClient.addStandardAddressCheckRequest.mockResolvedValue(requestSummary)

    const result = await addressService.addStandardAddressCheckRequest(
      token,
      agent,
      prisonNumber,
      standardAddressCheckRequest,
    )

    expect(result).toEqual(requestSummary)
  })

  it('Gets a standard address check request', async () => {
    const prisonNumber = 'A1234AE'
    const requestId = 49

    const requestSummary = createStandardAddressCheckRequestSummary()
    assessForEarlyReleaseApiClient.getStandardAddressCheckRequest.mockResolvedValue(requestSummary)

    const result = await addressService.getStandardAddressCheckRequest(token, agent, prisonNumber, requestId)

    expect(result).toEqual(requestSummary)
  })

  it('Adds a resident', async () => {
    const prisonNumber = 'A1234AE'
    const requestId = 49

    const addResidentRequest = createAddResidentRequest()
    const residentSummary = createResidentSummary()
    assessForEarlyReleaseApiClient.addResidents.mockResolvedValue([residentSummary])

    const result = await addressService.addResidents(token, agent, prisonNumber, requestId, [addResidentRequest])

    expect(result).toEqual([residentSummary])
  })
})
