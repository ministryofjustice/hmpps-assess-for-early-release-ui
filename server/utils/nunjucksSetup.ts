/* eslint-disable no-param-reassign */
import path from 'path'
import nunjucks, { Environment } from 'nunjucks'
import express from 'express'
import fs from 'fs'
import { Params, Path } from 'static-path'
import { startOfDay } from 'date-fns'
import { convertToTitleCase, formatDate, initialiseName, jsonDtToDateShort, toIsoDate } from './utils'
import config from '../config'
import logger from '../../logger'
import { ApplicationInfo } from '../applicationInfo'
import paths from '../routes/paths'
import { FieldValidationError } from '../@types/FieldValidationError'
import {
  AddressSummary,
  AssessmentSummary,
  EligibilityStatus,
  ResidentialCheckTaskStatus,
  SuitabilityStatus,
} from '../@types/assessForEarlyReleaseApiClientTypes'
import { tasks } from '../config/tasks'
import AssessmentStatus from '../enumeration/assessmentStatus'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, applicationInfo: ApplicationInfo): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Assess for early release – DPS'
  app.locals.dpsUrl = config.dpsUrl
  app.locals.environmentName = config.environmentName
  app.locals.environmentNameColour = config.environmentName === 'PRE-PRODUCTION' ? 'govuk-tag--green' : ''

  // Cache busting version string
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
  } catch (e: unknown) {
    if (process.env.NODE_ENV !== 'test') {
      logger.error(e, 'Could not read asset manifest file')
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

  // eslint-disable-next-line default-param-last
  njkEnv.addFilter('findError', (array: FieldValidationError[] = [], formFieldId: string) => {
    const item = array.find(error => error.field === formFieldId)
    if (item) {
      return {
        text: item.message,
      }
    }
    return null
  })

  njkEnv.addFilter('errorSummaryList', (array: FieldValidationError[] = []) => {
    return array.map(error => ({
      text: error.message,
      href: `#${error.field}`,
    }))
  })

  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('assetMap', (url: string) => assetManifest[url] || url)
  njkEnv.addFilter('toIsoDate', toIsoDate)
  njkEnv.addFilter('formatDate', formatDate)
  njkEnv.addFilter('toMillis', (date: Date) => (date ? date.getTime() : 0))

  njkEnv.addGlobal('coalesce', (...args: unknown[]) => args.find(item => item !== null && item !== undefined))
  njkEnv.addFilter('safeToString', (val: unknown) => (val !== null && val !== undefined ? val.toString() : val))

  njkEnv.addFilter('find', (vals: Record<string, unknown>[], attributeName, valueToFind: unknown) =>
    !vals ? [] : vals.find(val => val[attributeName] === valueToFind),
  )
  njkEnv.addFilter('filter', (vals: Record<string, unknown>[], attributeName, valueToFind: unknown) =>
    !vals ? [] : vals.filter(val => val[attributeName] === valueToFind),
  )
  njkEnv.addFilter('attr', (vals: Record<string, unknown>[], attributeName) =>
    !vals ? [] : vals.map(val => val[attributeName]),
  )

  njkEnv.addFilter('toFullName', (assessmentSummary: AssessmentSummary) =>
    convertToTitleCase(`${assessmentSummary.forename} ${assessmentSummary.surname}`.trim()),
  )

  njkEnv.addFilter(
    'dumpJson',
    (val: string) => new nunjucks.runtime.SafeString(`<pre>${JSON.stringify(val, null, 2)}</pre>`),
  )

  njkEnv.addGlobal('paths', paths)
  njkEnv.addGlobal('tasksList', tasks)
  njkEnv.addGlobal('dpsPrisonerProfileUrl', config.dpsPrisonerProfileUrl)

  njkEnv.addGlobal('eligibilityChecks', {
    eligibilityLabel: (status: EligibilityStatus) => {
      switch (status) {
        case 'NOT_STARTED':
          return {
            tag: {
              text: 'Incomplete',
              classes: 'govuk-tag--blue',
            },
          }
        case 'ELIGIBLE':
          return {
            text: 'Completed',
          }

        case 'INELIGIBLE':
          return {
            tag: {
              text: 'Ineligible',
              classes: 'govuk-tag--red',
            },
          }
        default:
          throw Error(`Unknown status: ${status}`)
      }
    },
    suitabilityLabel: (suitabilityBlocked: boolean, suitabilityStatus: SuitabilityStatus) => {
      if (suitabilityBlocked) {
        return {
          tag: {
            text: 'Cannot start yet',
            classes: 'govuk-tag--grey',
          },
        }
      }
      switch (suitabilityStatus) {
        case 'NOT_STARTED':
          return {
            tag: {
              text: 'Incomplete',
              classes: 'govuk-tag--blue',
            },
          }
        case 'SUITABLE':
          return {
            text: 'Completed',
          }
        case 'UNSUITABLE':
          return {
            tag: {
              text: 'Ineligible',
              classes: 'govuk-tag--red',
            },
          }
        default:
          throw Error(`Unknown status: ${suitabilityStatus}`)
      }
    },
  })

  njkEnv.addGlobal('residentialChecks', {
    taskStatusLabel: (status: ResidentialCheckTaskStatus) => {
      switch (status) {
        case 'NOT_STARTED':
          return {
            tag: {
              text: 'Incomplete',
              classes: 'govuk-tag--blue',
            },
          }
        case 'SUITABLE':
          return {
            text: 'Completed',
          }
        case 'UNSUITABLE':
          return {
            tag: {
              text: 'Ineligible',
              classes: 'govuk-tag--red',
            },
          }
        default:
          throw Error(`Unknown status: ${status}`)
      }
    },
  })

  njkEnv.addFilter('toPath', <T extends string>(staticPath: Path<T>, params: Params<T>) => {
    if (!staticPath) {
      throw Error(`no path provided`)
    }
    return staticPath(params)
  })

  njkEnv.addFilter('valuesToList', (list: { [key: string]: string }): string => {
    if (list) {
      return Object.values(list).filter(Boolean).join(', ')
    }
    return ''
  })

  njkEnv.addFilter('toAddressView', (addressSummary: AddressSummary) => {
    return {
      firstLine: addressSummary.firstLine,
      secondLine: addressSummary.secondLine,
      town: addressSummary.town,
      postcode: addressSummary.postcode,
    }
  })

  njkEnv.addFilter('getDay', (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.getDate().toString().padStart(2, '0')
  })

  njkEnv.addFilter('getMonth', (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return (date.getMonth() + 1).toString().padStart(2, '0')
  })

  njkEnv.addFilter('getYear', (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.getFullYear().toString()
  })

  njkEnv.addGlobal('tableAttributes', (data: { [key: string]: unknown }, field: string, index: number) => {
    return {
      id: `${field}-${index}`,
      'data-sort-value': data[field],
    }
  })

  njkEnv.addFilter('isTaskOverdue', (taskOverdueOn: string): boolean => {
    if (!taskOverdueOn) {
      return false
    }
    const today = startOfDay(new Date())
    const taskDate = new Date(taskOverdueOn)
    return taskDate < today
  })

  njkEnv.addFilter('datetimeToDateShort', (dt: string) => {
    return jsonDtToDateShort(dt)
  })

  njkEnv.addFilter('assessmentStatusToOutcome', (status: AssessmentStatus) => {
    switch (status) {
      case 'REFUSED':
        return 'Refused'
      case 'OPTED_OUT':
        return 'Opted out'
      case 'INELIGIBLE_OR_UNSUITABLE':
        return 'Presumed unsuitable/ineligible'
      case 'TIMED_OUT':
        return 'Timed out'
      default:
        return ''
    }
  })

  return njkEnv
}
