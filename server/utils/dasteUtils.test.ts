import getFormDate from './dateUtils'

describe('get a date from form data', () => {
  it('should return a date', () => {
    const namePrefix = 'informationSent'
    const formData = {
      'informationSent-day': '29',
      'informationSent-month': '6',
      'informationSent-year': '2019',
    }

    const result = getFormDate(namePrefix, formData)
    expect(result).toBe('2019-06-29')
  })

  it('should return undefined for date parameters out of range', () => {
    const namePrefix = 'informationSent'
    const formData = {
      'informationSent-day': '32',
      'informationSent-month': '6',
      'informationSent-year': '2019',
    }

    const result = getFormDate(namePrefix, formData)
    expect(result).toBeUndefined()
  })
  it('should return undefined for invalid date', () => {
    const namePrefix = 'informationSent'
    const formData = {
      'informationSent-day': '12',
      'informationSent-month': '8',
      'informationSent-year': '2019abc',
    }

    const result = getFormDate(namePrefix, formData)
    expect(result).toBeUndefined()
  })
})
