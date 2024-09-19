/* eslint-disable no-param-reassign */
import path from 'path'
import nunjucks, { Environment } from 'nunjucks'
import express from 'express'
import fs from 'fs'
import { Params, Path } from 'static-path'
import { formatDate, initialiseName, toIsoDate } from './utils'
import config from '../config'
import logger from '../../logger'
import { ApplicationInfo } from '../applicationInfo'
import paths from '../routes/paths'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, applicationInfo: ApplicationInfo): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Hmpps Assess For Early Release Ui'
  app.locals.dpsUrl = config.dpsUrl
  app.locals.environmentName = config.environmentName
  app.locals.environmentNameColour = config.environmentName === 'PRE-PRODUCTION' ? 'govuk-tag--green' : ''

  // Cachebusting version string
  if (production) {
    // Version only changes with each commit
    app.locals.version = applicationInfo.gitShortHash
  } else {
    // Version changes every request
    app.use((req, res, next) => {
      res.locals.version = Date.now().toString()
      return next()
    })
  }

  registerNunjucks(app)
}

export function registerNunjucks(app?: express.Express): Environment {
  let assetManifest: Record<string, string> = {}

  try {
    const assetMetadataPath = path.resolve(__dirname, '../../assets/manifest.json')
    assetManifest = JSON.parse(fs.readFileSync(assetMetadataPath, 'utf8'))
  } catch (e) {
    if (process.env.NODE_ENV !== 'test') {
      logger.error('Could not read asset manifest file')
    }
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/dist/',
      'node_modules/@ministryofjustice/frontend/',
    ],
    {
      autoescape: true,
      express: app,
    },
  )

  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('assetMap', (url: string) => assetManifest[url] || url)
  njkEnv.addFilter('toIsoDate', toIsoDate)
  njkEnv.addFilter('formatDate', formatDate)
  njkEnv.addFilter('toMillis', (date: Date) => (date ? date.getTime() : 0))

  njkEnv.addFilter(
    'dumpJson',
    (val: string) => new nunjucks.runtime.SafeString(`<pre>${JSON.stringify(val, null, 2)}</pre>`),
  )
  njkEnv.addGlobal('paths', paths)
  njkEnv.addFilter('toPath', <T extends string>(staticPath: Path<T>, params: Params<T>) => {
    if (!staticPath) {
      throw Error(`no path provided`)
    }
    return staticPath(params)
  })

  return njkEnv
}
