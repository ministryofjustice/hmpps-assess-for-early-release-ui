import { expect, test } from '@playwright/test'
import { resetStubs } from './mockApis/wiremock'
import { getSignInUrl } from './mockApis/auth'
import { login, stubFeComponents } from './testUtils'

test.describe('SignIn', () => {
  test.afterEach(async () => {
    await resetStubs()
  })
  test('Unauthenticated user directed to auth', async ({ page }) => {
    await page.goto('/')
    const url = await getSignInUrl()
    await page.goto(`${url}/`)
    await expect(page.getByRole('heading')).toHaveText('Authorisation Error')
  })

  test('Unauthenticated user navigating to sign in page directed to auth', async ({ page }) => {
    await page.goto('/')
    const url = await getSignInUrl()
    await page.goto(`${url}/sign-in`)
    await expect(page.getByRole('heading')).toHaveText('Authorisation Error')
  })

  test('Common components header and footer should display', async ({ page }) => {
    await stubFeComponents()
    await login({ authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'] })

    await page.goto('/')
    const url = await getSignInUrl()
    await page.goto(url)
    await expect(page.getByText('Common Components Header')).toBeVisible()
    await expect(page.getByText('Common Components Footer')).toBeVisible()
  })

  test('Common components header and footer should not display', async ({ page }) => {
    await login({ authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'] })

    await page.goto('/')
    const url = await getSignInUrl()
    await page.goto(url)
    await expect(page.getByText('Common Components Header')).not.toBeVisible()
    await expect(page.getByText('Common Components Footer')).not.toBeVisible()
  })

  test('User can sign out', async ({ page }) => {
    await login({ authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'] })

    await page.goto('/')
    const url = await getSignInUrl()
    await page.goto(url)
    await page.getByText('Sign out').click()
    await expect(page.getByRole('heading')).toHaveText('AFER Sign in')
  })

  test('User name visible in header', async ({ page }) => {
    await login({ authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'] })
    await page.goto('/')
    const url = await getSignInUrl()
    await page.goto(url)
    await expect(page.getByTestId('header-user-name')).toHaveText('B. Brown')
  })

  test('Token verification failure takes user to sign in page', async ({ page }) => {
    await login({ authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'] }, false)
    await page.goto('/')
    const url = await getSignInUrl()
    await page.goto(url)
    await expect(page.getByRole('heading')).toHaveText('AFER Sign in')
  })

  test('Token verification failure clears user session', async ({ page }) => {
    await login({ authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'] }, false)
    await page.goto('/')
    const url = await getSignInUrl()
    await page.goto(url)
    await expect(page.getByRole('heading')).toHaveText('AFER Sign in')

    await login({ authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'] })
    await page.goto('/')
    const url1 = await getSignInUrl()
    await page.goto(url1)
    await expect(page.getByTestId('header-user-name')).toHaveText('B. Brown')
  })
})
