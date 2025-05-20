import isValidPhoneNumber from './validationUtils'

describe('is valid phone number', () => {
  it.each([
    ['null', null, false],
    ['empty string', '', false],
    ['contains non numeric characters', '02071X234567', false],
    ['geographic number', '02071234567', true],
    ['geographic number with white space', '020 7123 4567', true],
    ['non geographic number', '08456 495 962', true],
    ['mobile number', '07832 284 072', true],
    ['E.164 format', '+44 20 7123 4567', true],
  ])('%s isValidPhoneNumber(%s, %s)', (_: string, testValue: string, expectedValue: boolean) => {
    expect(isValidPhoneNumber(testValue)).toEqual(expectedValue)
  })
})
