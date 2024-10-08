import express, { Express } from 'express'
import { NotFound } from 'http-errors'

import routes from '../index'
import nunjucksSetup from '../../utils/nunjucksSetup'
import errorHandler from '../../errorHandler'
import * as auth from '../../authentication/auth'
import type { Services } from '../../services'
import AuditService from '../../services/auditService'
import { HmppsUser } from '../../interfaces/hmppsUser'
import setUpWebSession from '../../middleware/setUpWebSession'
import { ApplicationInfo } from '../../applicationInfo'
import setUpHealthChecks from '../../middleware/setUpHealthChecks'

jest.mock('../../services/auditService')

const testAppInfo: ApplicationInfo = {
  applicationName: 'test',
  buildNumber: '1',
  gitRef: 'long ref',
  gitShortHash: 'short ref',
  branchName: 'main',
  productId: 'DPS01',
}

export const user: HmppsUser = {
  name: 'FIRST LAST',
  userId: 'id',
  token: 'token',
  username: 'user1',
  displayName: 'First Last',
  authSource: 'nomis',
  staffId: 1234,
  userRoles: [],
}

export const flashProvider = jest.fn()

function appSetup(
  services: Services,
  production: boolean,
  userSupplier: () => HmppsUser,
  middlewareInjector: (app: ReturnType<typeof express>) => void = () => {},
) {
  const app = express()

  app.set('view engine', 'njk')

  nunjucksSetup(app, testAppInfo)
  app.use(setUpHealthChecks(testAppInfo))
  app.use(setUpWebSession())
  app.use((req, res, next) => {
    req.user = userSupplier() as Express.User
    req.flash = flashProvider
    res.locals = {
      user: { ...req.user } as HmppsUser,
    }
    next()
  })
  app.use((req, res, next) => {
    req.id = crypto.randomUUID()
    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  middlewareInjector(app)
  app.use(routes(services))

  app.use((req, res, next) => next(new NotFound()))
  app.use(errorHandler(production))

  return app
}

export function appWithAllRoutes({
  production = false,
  services = {
    auditService: new AuditService(null) as jest.Mocked<AuditService>,
  },
  userSupplier = () => user,
  middlewareInjector = () => {},
}: {
  production?: boolean
  services?: Partial<Services>
  userSupplier?: () => HmppsUser
  middlewareInjector?: (app: ReturnType<typeof express>) => void
}): Express {
  auth.default.authenticationMiddleware = () => (req, res, next) => next()
  return appSetup(services as Services, production, userSupplier, middlewareInjector)
}
