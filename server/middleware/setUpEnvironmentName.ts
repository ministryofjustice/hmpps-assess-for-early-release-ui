/* eslint-disable no-param-reassign */
import type { Express } from 'express'

import config from '../config'

export default function setUpEnvironmentName(app: Express) {
  app.locals.environmentName = config.environmentName
  app.locals.environmentNameColour = config.environmentName === 'preprod' ? 'govuk-tag--green' : ''
}
