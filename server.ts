// Require app insights before anything else to allow for instrumentation of bunyan and express
import 'applicationinsights'

import logger from './logger'

import createApplicationInfo from './server/applicationInfo'

import app from './server/index'

import { initialiseAppInsights } from './server/utils/azureAppInsights'

const applicationInfo = createApplicationInfo()
initialiseAppInsights(applicationInfo)

const server = app(applicationInfo)

server.listen(server.get('port'), () => {
  logger.info(`Server listening on port ${server.get('port')}`)
})
