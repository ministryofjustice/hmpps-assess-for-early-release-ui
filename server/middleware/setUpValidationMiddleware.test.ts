import { FieldValidationError } from '../@types/FieldValidationError'
import { mockNext, mockRequest, mockResponse } from '../routes/__testutils/requestTestUtils'
import {
  FLASH_KEY_SUBMITTED_FORM,
  FLASH_KEY_VALIDATION_ERRORS,
  ValidationError,
  validateRequest,
  validationMiddleware,
} from './setUpValidationMiddleware'

export type Validator = (body: Record<string, unknown>) => FieldValidationError[]

describe('setUpValidationMiddleware', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('validateRequest', () => {
    test('no errors', () => {
      const request = mockRequest({})
      validateRequest(request, () => [])
      expect(request.flash).not.toHaveBeenCalled()
    })

    test('when an error occurs', () => {
      const errors = [{ field: 'some-field', message: 'An error occurred' }]
      const request = mockRequest({})

      expect(() => validateRequest(request, () => errors)).toThrow(ValidationError)
      expect(request.flash).toHaveBeenCalledWith(FLASH_KEY_VALIDATION_ERRORS, errors)
      expect(request.flash).toHaveBeenCalledWith(FLASH_KEY_SUBMITTED_FORM, {})
    })

    test('form is persisted in flash', () => {
      const errors = [{ field: 'some-field', message: 'An error occurred' }]
      const body = { some: 'value' }
      const request = mockRequest({ body })

      expect(() => validateRequest(request, () => errors)).toThrow(ValidationError)
      expect(request.flash).toHaveBeenCalledWith(FLASH_KEY_VALIDATION_ERRORS, errors)
      expect(request.flash).toHaveBeenCalledWith(FLASH_KEY_SUBMITTED_FORM, body)
    })
  })
})

describe('validationMiddleware', () => {
  test('flash and next to have been called as expected', () => {
    const request = mockRequest({})
    const response = mockResponse({})
    const next = mockNext()

    request.flash.mockReturnValue({})

    validationMiddleware(request, response, next)

    expect(request.flash).toHaveBeenCalledWith(FLASH_KEY_VALIDATION_ERRORS)
    expect(request.flash).toHaveBeenCalledWith(FLASH_KEY_SUBMITTED_FORM)
    expect(next).toHaveBeenCalledWith()
  })

  test('errors and form submit are copied over', () => {
    const request = mockRequest({})
    const response = mockResponse({})
    const next = mockNext()

    const submittedForm = { some: 'value' }
    const validationErrors: FieldValidationError[] = [{ field: 'fields-1', message: 'message-1' }]

    request.flash.mockReturnValueOnce(validationErrors).mockReturnValueOnce([submittedForm])

    validationMiddleware(request, response, next)

    expect(response.locals.validationErrors).toStrictEqual(validationErrors)
    expect(response.locals.submittedForm).toStrictEqual(submittedForm)
  })
})
