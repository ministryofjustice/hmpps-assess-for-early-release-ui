import express, { NextFunction, Request, Response, Router } from 'express'

import { FieldValidationError } from '../@types/FieldValidationError'

export type Validator = (body: Record<string, unknown>) => FieldValidationError[]

export const FLASH_KEY_VALIDATION_ERRORS = 'validationErrors'
export const FLASH_KEY_SUBMITTED_FORM = 'submittedForm'

export function validateRequest(request: Request, validator: Validator) {
  const errors = validator(request.body)
  if (errors.length) {
    request.flash(FLASH_KEY_VALIDATION_ERRORS, errors)
    request.flash(FLASH_KEY_SUBMITTED_FORM, request.body)
    throw new ValidationError('A validation error occurred')
  }
}

export function validationMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    res.locals.validationErrors = req.flash(FLASH_KEY_VALIDATION_ERRORS)
    res.locals.submittedForm = req.flash(FLASH_KEY_SUBMITTED_FORM)?.[0]
    next()
  } catch (err) {
    next(err)
  }
}

export default function setUpValidationMiddleware(): Router {
  const router = express.Router()
  router.use(validationMiddleware)
  return router
}

export class ValidationError extends Error {
  constructor(message?: string) {
    super(message)

    // restore prototype chain
    const actualProto = new.target.prototype

    Object.setPrototypeOf(this, actualProto)
  }
}
