import {
  defaultClient,
  DistributedTracingModes,
  getCorrelationContext,
  setup,
  TelemetryClient,
} from 'applicationinsights'
import { RequestHandler } from 'express'
import type { ApplicationInfo } from '../applicationInfo'

export function initialiseAppInsights(applicationInfo: ApplicationInfo): TelemetryClient {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    // eslint-disable-next-line no-console
    console.log('Enabling azure application insights')

    setup().setDistributedTracingMode(DistributedTracingModes.AI_AND_W3C).start()
    defaultClient.context.tags['ai.cloud.role'] = applicationInfo.applicationName
    defaultClient.context.tags['ai.application.ver'] = applicationInfo.buildNumber
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
