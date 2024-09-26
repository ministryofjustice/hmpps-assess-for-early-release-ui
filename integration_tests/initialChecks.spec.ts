import { expect, test } from '@playwright/test'
import assessForEarlyRelease from './mockApis/assessForEarlyRelease'
import { login, resetStubs } from './testUtils'
import paths from '../server/routes/paths'

test.describe('Initial checks', () => {
  test.beforeEach(async () => {
    await resetStubs()
  })
  test('Offender can complete initial checks', async ({ page }) => {
    const prisonNumber = 'A1234AE'

    await assessForEarlyRelease.stubGetInitialChecks(prisonNumber)

    await login(page, { authorities: ['ROLE_LICENCE_CA'] })

    await page.goto(paths.prison.assessment.initialChecks.tasklist({ prisonNumber }))

    await expect(page.getByRole('heading', { name: 'Assess eligibility and suitability' })).toBeVisible()

    await page.getByRole('link', { name: 'Answer the first question' }).click()

    // answer question 1 for eligibilty check 1 and check validation
    await expect(page.getByRole('heading', { name: 'Please answer question 1' })).toBeVisible()
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page.getByRole('heading', { name: 'There is a problem' })).toBeVisible()
    await page.getByRole('link', { name: 'Please answer question 1' }).click()
    await expect(page.locator('*:focus')).toHaveValue('true')
    await page.getByLabel('Yes').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    // answer 2 questions for eligibilty check 2
    await page.getByRole('group', { name: 'Please answer question 2' }).getByLabel('Yes').click()
    await page.getByRole('group', { name: 'Please answer question 3' }).getByLabel('Yes').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.getByRole('heading', { name: 'Assess eligibility and suitability' })).toBeVisible()

    await page.getByRole('link', { name: 'Answer the first suitability question' }).click()

    // answer 1 question for suitability check 1
    await expect(page.getByRole('heading', { name: 'Please answer question 4' })).toBeVisible()
    await page.getByRole('group', { name: 'Please answer question 4' }).getByLabel('Yes').click()
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page.getByRole('heading', { name: 'Assess eligibility and suitability' })).toBeVisible()
  })
})
