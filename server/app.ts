import express from 'express'

import createError from 'http-errors'

import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import { appInsightsMiddleware } from './utils/azureAppInsights'
import authorisationMiddleware from './middleware/authorisationMiddleware'

import setUpAuthentication from './middleware/setUpAuthentication'
import setUpCsrf from './middleware/setUpCsrf'
import setUpCurrentUser from './middleware/setUpCurrentUser'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'

import routes from './routes'
import type { Services } from './services'
import populateClientToken from './middleware/populateClientToken'
import { ApplicationInfo } from './applicationInfo'
import getFrontendComponents from './middleware/getFrontendComponents'
import setUpEnvironmentName from './middleware/setUpEnvironmentName'
import phaseNameSetup from './middleware/phaseNameSetup'
import config from './config'
import setUpValidationMiddleware from './middleware/setUpValidationMiddleware'
import pdfRenderer from './utils/pdfRenderer'

export default function createApp(services: Services, applicationInfo: ApplicationInfo): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(appInsightsMiddleware())
  app.use(setUpHealthChecks(applicationInfo))
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  setUpEnvironmentName(app)
  nunjucksSetup(app, applicationInfo)
  phaseNameSetup(app, config.phaseName)
  app.use(setUpAuthentication())
  app.use(authorisationMiddleware())
  app.use(pdfRenderer())
  app.use(setUpCsrf())
  app.use(populateClientToken(services.dataAccess.authClient))
  app.use(setUpCurrentUser(services.userService, services.dataAccess.verificationClient))
  app.get('*', getFrontendComponents(services.hmppsComponentsService))

  app.use(setUpValidationMiddleware())
  app.use(routes(services))

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
