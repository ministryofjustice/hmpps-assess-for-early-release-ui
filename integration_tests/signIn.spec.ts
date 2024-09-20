import { expect, test } from '@playwright/test'
import tokenVerification from './mockApis/tokenVerification'
import { resetStubs } from './mockApis/wiremock'
import feComponent from './mockApis/feComponent'
import { getSignInUrl, favicon, signIn, signOut, token } from './mockApis/auth'

async function login({ authorities }: { authorities: string[] }, active = true) {
  await Promise.all([
    favicon(),
    signIn(),
    signOut(),
    token({ authorities }),
    tokenVerification.stubVerifyToken(active),
    feComponent.stubFeComponentsFail(),
  ])
}

test.describe('SignIn', () => {
  test.afterEach(async () => {
    resetStubs()
  })
  test('Unauthenticated user directed to auth', async ({ page }) => {
    await page.goto('http://localhost:3007/')
    const url = await getSignInUrl()
    await page.goto(`http://localhost:3007${url}/`)
    await expect(page.getByRole('heading')).toHaveText('Authorisation Error')
  })

  test('Unauthenticated user navigating to sign in page directed to auth', async ({ page }) => {
    await page.goto('http://localhost:3007/')
    const url = await getSignInUrl()
    await page.goto(`http://localhost:3007${url}/sign-in`)
    await expect(page.getByRole('heading')).toHaveText('Authorisation Error')
  })

  test('Common components header and footer should display', async ({ page }) => {
    await feComponent.stubFeComponents()
    await feComponent.stubFeComponentsJs()
    await feComponent.stubFeComponentsCss()
    await login({ authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'] })

    await page.goto('http://localhost:3007/')
    const url = await getSignInUrl()
    await page.goto(`http://localhost:3007${url}`)
    await expect(page.getByText('Common Components Header')).toBeVisible()
    await expect(page.getByText('Common Components Footer')).toBeVisible()
  })

  test('Common components header and footer should not display', async ({ page }) => {
    await login({ authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'] })

    await page.goto('http://localhost:3007/')
    const url = await getSignInUrl()
    await page.goto(`http://localhost:3007${url}`)
    await expect(page.getByText('Common Components Header')).not.toBeVisible()
    await expect(page.getByText('Common Components Footer')).not.toBeVisible()
  })

  test('User can sign out', async ({ page }) => {
    await login({ authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'] })

    await page.goto('http://localhost:3007/')
    const url = await getSignInUrl()
    await page.goto(`http://localhost:3007${url}`)
    await page.getByText('Sign out').click()
    await expect(page.getByRole('heading')).toHaveText('AFER Sign in')
  })

  test('User name visible in header', async ({ page }) => {
    await login({ authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'] })
    await page.goto('http://localhost:3007/')
    const url = await getSignInUrl()
    await page.goto(`http://localhost:3007${url}`)
    await expect(page.getByTestId('header-user-name')).toHaveText('B. Brown')
  })

  test('Token verification failure takes user to sign in page', async ({ page }) => {
    await login({ authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'] }, false)
    await page.goto('http://localhost:3007/')
    const url = await getSignInUrl()
    await page.goto(`http://localhost:3007${url}`)
    await expect(page.getByRole('heading')).toHaveText('AFER Sign in')
  })

  test('Token verification failure clears user session', async ({ page }) => {
    await login({ authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'] }, false)
    await page.goto('http://localhost:3007/')
    const url = await getSignInUrl()
    await page.goto(`http://localhost:3007${url}`)
    await expect(page.getByRole('heading')).toHaveText('AFER Sign in')

    await login({ authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'] })
    await page.goto('http://localhost:3007/')
    const url1 = await getSignInUrl()
    await page.goto(`http://localhost:3007${url1}`)
    await expect(page.getByTestId('header-user-name')).toHaveText('B. Brown')
  })
})
