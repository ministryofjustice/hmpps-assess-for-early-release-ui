import { Page } from '@playwright/test'
import tokenVerification from './mockApis/tokenVerification'
import feComponent from './mockApis/feComponent'
import { favicon, getSignInUrl, signIn, signOut, token } from './mockApis/auth'
import { resetStubs } from './mockApis/wiremock'

export { resetStubs }

export async function login(
  page: Page,
  {
    authorities,
    active = true,
    feComponentsFail = true,
    authSource = 'nomis',
  }: {
    authorities: string[]
    active?: boolean
    feComponentsFail?: boolean
    authSource?: 'nomis' | 'delius'
  },
) {
  await Promise.all([
    favicon(),
    signIn(),
    signOut(),
    token({ authorities, authSource }),
    tokenVerification.stubVerifyToken(active),
    feComponentsFail ? feComponent.stubFeComponentsFail() : feComponent.stubFeComponentsSuccess(),
  ])
  await page.goto('/')
  const url = await getSignInUrl()
  await page.goto(url)
}
