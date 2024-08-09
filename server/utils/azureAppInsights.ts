import {
  defaultClient,
  DistributedTracingModes,
  getCorrelationContext,
  setup,
  TelemetryClient,
  Contracts,
} from 'applicationinsights'
import { RequestHandler } from 'express'
import type { ApplicationInfo } from '../applicationInfo'
import { HmppsUser } from '../interfaces/hmppsUser'

type TelemetryProcessor = Parameters<typeof TelemetryClient.prototype.addTelemetryProcessor>[0]

export function initialiseAppInsights(applicationInfo: ApplicationInfo): TelemetryClient {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    // eslint-disable-next-line no-console
    console.log('Enabling azure application insights')

    setup().setDistributedTracingMode(DistributedTracingModes.AI_AND_W3C).start()
    defaultClient.context.tags['ai.cloud.role'] = applicationInfo.applicationName
    defaultClient.context.tags['ai.application.ver'] = applicationInfo.buildNumber
    defaultClient.addTelemetryProcessor(addUserDataToRequests)
    return defaultClient
  }
  return null
}

export function appInsightsMiddleware(): RequestHandler {
  return (req, res, next) => {
    res.prependOnceListener('finish', () => {
      const context = getCorrelationContext()
      if (context && req.route) {
        context.customProperties.setProperty('operationName', `${req.method} ${req.route?.path}`)
      }
    })
    next()
  }
}

export const addUserDataToRequests: TelemetryProcessor = (envelope, contextObjects) => {
  const isRequest = envelope.data.baseType === Contracts.TelemetryTypeString.Request
  if (isRequest) {
    const user = contextObjects?.['http.ServerRequest']?.res?.locals?.user
    if (user) {
      const { properties } = envelope.data.baseData
      // eslint-disable-next-line no-param-reassign
      envelope.data.baseData.properties = { ...getUserDetails(user), ...properties }
    }
  }
  return true
}

const getUserDetails = (user: HmppsUser) => {
  const { name, userId, token, username, displayName, authSource, userRoles } = user

  return {
    name,
    userId,
    token,
    username,
    displayName,
    authSource,
    userRoles,
  }
}
