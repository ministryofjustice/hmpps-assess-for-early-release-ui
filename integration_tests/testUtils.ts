import tokenVerification from './mockApis/tokenVerification'
import feComponent from './mockApis/feComponent'
import { favicon, signIn, signOut, token } from './mockApis/auth'

export async function login({ authorities }: { authorities: string[] }, active = true) {
  await Promise.all([
    favicon(),
    signIn(),
    signOut(),
    token({ authorities }),
    tokenVerification.stubVerifyToken(active),
    feComponent.stubFeComponentsFail(),
  ])
}

export async function stubFeComponents() {
  await feComponent.stubFeComponents()
  await feComponent.stubFeComponentsJs()
  await feComponent.stubFeComponentsCss()
}
