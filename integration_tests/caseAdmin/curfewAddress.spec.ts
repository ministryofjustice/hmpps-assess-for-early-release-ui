import { expect, test } from '@playwright/test'
import assessForEarlyRelease from '../mockApis/assessForEarlyRelease'
import { assessmentSummary } from '../mockApis/assessForEarlyReleaseData'

import { login, resetStubs } from '../testUtils'
import paths from '../../server/routes/paths'
import { AddressSummary } from '../../server/@types/assessForEarlyReleaseApiClientTypes'
import playwrightConfig from '../../playwright.config'

test.describe('Can add a curfew address and a main resident', () => {
  test.afterEach(async () => {
    await resetStubs()
  })
  test('Case admin can find and select an address and then add a resident', async ({ page }) => {
    const prisonNumber = 'A1234AE'
    const postcode = 'RG11DB'
    const addressCheckRequestId = 1
    const addressSummaries = [
      {
        uprn: '310010433',
        firstLine: '97, HARTLAND ROAD',
        secondLine: '',
        town: 'READING',
        county: 'READING',
        postcode: 'RG2 8AF',
        country: 'England',
        xcoordinate: 472219.0,
        ycoordinate: 170067.0,
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
        xcoordinate: 472231.0,
        ycoordinate: 170070.0,
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
        xcoordinate: 472274.0,
        ycoordinate: 170113.0,
        addressLastUpdated: new Date('2019-08-15'),
      },
    ] as AddressSummary[]

    await assessForEarlyRelease.stubGetAssessmentSummary(assessmentSummary(prisonNumber))
    await assessForEarlyRelease.stubGetAddressesForPostcode(postcode, addressSummaries)
    await assessForEarlyRelease.stubAddStandardAddressCheckRequest(prisonNumber)
    await assessForEarlyRelease.stubGetStandardAddressCheckRequest(prisonNumber, addressCheckRequestId)
    await assessForEarlyRelease.stubAddResident(prisonNumber, addressCheckRequestId)

    await login(page, { authorities: ['ROLE_LICENCE_CA'] })

    await page.goto(paths.prison.assessment.enterCurfewAddressOrCasArea.findAddress({ prisonNumber }))
    await page.getByTestId('addressInput').fill(postcode)
    await page.getByTestId('searchAddresses').click()

    await page.getByTestId('address-1').click()
    await page.getByTestId('useThisAddress').click()

    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.prison.assessment.enterCurfewAddressOrCasArea.addResidentDetails({ prisonNumber, checkRequestId: '1' })}`,
    )

    const forename = 'Bob'
    const surname = 'Carragher'
    const relation = 'sister'
    await page.getByTestId('resident-forename').fill(forename)
    await page.getByTestId('resident-surname').fill(surname)
    await page.getByTestId('resident-relation').fill(relation)
    await page.getByTestId('addResidentContinue').click()

    await expect(page).toHaveURL(
      `${playwrightConfig.use.baseURL}${paths.prison.assessment.enterCurfewAddressOrCasArea.moreInformationRequiredCheck({ prisonNumber, checkRequestId: '1' })}`,
    )
  })
})
