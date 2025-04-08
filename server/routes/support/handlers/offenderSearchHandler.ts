import { Request, Response } from 'express'
import SupportService from '../../../services/supportService'
import { validateRequest } from '../../../middleware/setUpValidationMiddleware'
import { FieldValidationError } from '../../../@types/FieldValidationError'
import logger from '../../../../logger'
import paths from '../../paths'

export default class OffenderSearchHandler {
  constructor(private readonly supportService: SupportService) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const searchOffenderQuery = req.params.searchOffenderQuery as string

    logger.info('Offender Results:', searchOffenderQuery)
    if (searchOffenderQuery) {
      const offenderResults = await this.supportService.doOffenderSearch(
        req?.middleware?.clientToken,
        res.locals.agent,
        searchOffenderQuery,
      )

      res.render('pages/support/offender/search', {
        offenderResults,
        searchOffenderQuery,
      })
    } else {
      res.render('pages/support/offender/search')
    }
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    validateRequest(req, () => {
      const validationErrors: FieldValidationError[] = []

      if (!req.body.searchOffenderQuery) {
        validationErrors.push({ field: 'searchOffenderQuery', message: 'Enter prison number or crn number' })
      } else {
        if (req.body.searchOffenderQuery.length < 4) {
          validationErrors.push({ field: 'searchOffenderQuery', message: 'The search string length must 4 or more' })
        }
        if (req.body.searchOffenderQuery.length > 10) {
          validationErrors.push({ field: 'searchOffenderQuery', message: 'The search string length must 10 or less' })
        }
        const regex = /^[0-9A-Z]$/
        if (regex.test(req.body.searchOffenderQuery)) {
          validationErrors.push({
            field: 'searchOffenderQuery',
            message: 'The search string must be alpha numeric and upper case',
          })
        }
      }

      return validationErrors
    })

    const searchOffenderQuery = (req.body.searchOffenderQuery as string).replace(/\s+/g, '')
    logger.info('Post to get offender:', searchOffenderQuery)

    return res.redirect(`${paths.support.offender.supportOffenderSearchView({ searchOffenderQuery })}`)
  }
}
