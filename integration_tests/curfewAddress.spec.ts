import { expect, test } from '@playwright/test'
import assessForEarlyRelease from './mockApis/assessForEarlyRelease'
import { assessmentSummary } from './mockApis/assessForEarlyReleaseData'

import { login, resetStubs } from './testUtils'
import paths from '../server/routes/paths'
import { AddressSummary } from '../server/@types/assessForEarlyReleaseApiClientTypes'
import playwrightConfig from '../playwright.config'

test.describe('Can add a curfew address and a main resident', () => {
  test.afterEach(async () => {
    await resetStubs()
  })
  test('Case admin can find and select an address and then add a resident', async ({ page }) => {
    const prisonNumber = 'A1234AE'
    const postcode = 'RG11DB'
    const addressSummaries = [
      {
        uprn: '310010433',
        firstLine: '97, HARTLAND ROAD',
        secondLine: '',
        town: 'READING',
        county: 'READING',
        postcode: 'RG2 8AF',
        country: 'England',
        xCoordinate: 472219.0,
        yCoordinate: 170067.0,
        addressLastUpdated: '2020-06-25',
      },
      {
        uprn: '310030567',
        firstLine: '99, HARTLAND ROAD',
        secondLine: '',
        town: 'READING',
        county: 'READING',
        postcode: 'RG2 8AF',
        country: 'England',
        xCoordinate: 472231.0,
        yCoordinate: 170070.0,
        addressLastUpdated: '2020-06-25',
      },
      {
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
      },
    ] as AddressSummary[]

    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummary(prisonNumber))
    await assessForEarlyRelease.stubGetAddressesForPostcode(postcode, addressSummaries)
    await assessForEarlyRelease.stubAddStandardAddressCheckRequest(prisonNumber)
    await assessForEarlyRelease.stubGetStandardAddressCheckRequest(prisonNumber, 1)

    await login(page, { authorities: ['ROLE_LICENCE_CA'] })

    await page.goto(paths.prison.assessment.curfewAddress.findAddress({ prisonNumber }))
    await page.getByTestId('addressInput').fill(postcode)
    await page.getByTestId('searchAddresses').click()

    await page.getByTestId('address-1').click()
    await page.getByTestId('useThisAddress').click()

    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}/prison/assessment/A1234AE/curfew-address/resident-details/1`,
    )
  })
})
