import { expect, test } from '@playwright/test'
import { getSignInUrl } from './mockApis/auth'
import { login, resetStubs } from './testUtils'

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
    await login(page, { authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'], feComponentsFail: false })

    await expect(page.getByText('Common Components Header')).toBeVisible()
    await expect(page.getByText('Common Components Footer')).toBeVisible()
  })

  test('Common components header and footer should not display', async ({ page }) => {
    await login(page, { authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'], feComponentsFail: true })

    await expect(page.getByText('Common Components Header')).not.toBeVisible()
    await expect(page.getByText('Common Components Footer')).not.toBeVisible()
  })

  test('User can sign out', async ({ page }) => {
    await login(page, { authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'] })

    await page.getByText('Sign out').click()
    await expect(page.getByRole('heading')).toHaveText('AFER Sign in')
  })

  test('User name visible in header', async ({ page }) => {
    await login(page, { authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'] })

    await expect(page.getByTestId('header-user-name')).toHaveText('K. Kone')
  })

  test('Token verification failure takes user to sign in page', async ({ page }) => {
    await login(page, {
      authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'],
      active: false,
      feComponentsFail: false,
    })

    await expect(page.getByRole('heading')).toHaveText('AFER Sign in')
  })

  test('Token verification failure clears user session', async ({ page }) => {
    await login(page, {
      authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'],
      active: false,
    })

    await expect(page.getByRole('heading')).toHaveText('AFER Sign in')

    await login(page, {
      authorities: ['ROLE_LICENCE_CA', 'ROLE_NOMIS_BATCHLOAD'],
      active: true,
    })

    await expect(page.getByTestId('header-user-name')).toHaveText('K. Kone')
  })
})
