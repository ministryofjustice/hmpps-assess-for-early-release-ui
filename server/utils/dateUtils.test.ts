import { getFormDate, toFormDate } from './dateUtils'

describe('date utils', () => {
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

  describe('convert a string to a object containing values for a date input', () => {
    it('should not convert an invalid date string', () => {
      expect(toFormDate('date', undefined)).toEqual({})
      expect(toFormDate('date', null)).toEqual({})
      expect(toFormDate('date', '12')).toEqual({})
    })

    it('should convert a valid date string', () => {
      expect(toFormDate('date', '2019-06-29')).toEqual({
        'date-year': '2019',
        'date-month': '06',
        'date-day': '29',
      })
    })
  })
})
