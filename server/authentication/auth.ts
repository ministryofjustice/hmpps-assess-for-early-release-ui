import passport from 'passport'
import { Strategy } from 'passport-oauth2'
import type { RequestHandler } from 'express'

import { VerificationClient } from '@ministryofjustice/hmpps-auth-clients'
import config from '../config'
import generateOauthClientToken from './clientCredentials'

passport.serializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user)
})

passport.deserializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user as Express.User)
})

export type AuthenticationMiddleware = (tokenVerifier: VerificationClient) => RequestHandler

const authenticationMiddleware: AuthenticationMiddleware = tokenVerifier => {
  return async (req, res, next) => {
    if (req.isAuthenticated() && (await tokenVerifier.verifyToken(req))) {
      return next()
    }
    req.session.returnTo = req.originalUrl
    return res.redirect('/sign-in')
  }
}

function init(): void {
  const strategy = new Strategy(
    {
      authorizationURL: `${config.apis.hmppsAuth.externalUrl}/oauth/authorize`,
      tokenURL: `${config.apis.hmppsAuth.url}/oauth/token`,
      clientID: config.apis.hmppsAuth.apiClientId,
      clientSecret: config.apis.hmppsAuth.apiClientSecret,
      callbackURL: `${config.domain}/sign-in/callback`,
      state: true,
      customHeaders: { Authorization: generateOauthClientToken() },
    },
    (token, refreshToken, params, profile, done) => {
      return done(null, {
        token,
        username: params.user_name,
        authSource: params.auth_source,
        userRoles: params.authorities,
      })
    },
  )

  passport.use(strategy)
}

export default {
  authenticationMiddleware,
  init,
}
