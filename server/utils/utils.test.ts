import AuthRole from '../enumeration/authRole'
import { convertToTitleCase, hasRole, initialiseName, formatDate, getOrdinal, jsonDtToDateShort } from './utils'

describe('convert to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'test', 'Test'],
    ['Upper case', 'TEST', 'Test'],
    ['Mixed case', 'TeSt', 'Test'],
    ['Multiple words', 'TEst PERsON', 'Test Person'],
    ['Leading spaces', '  TeST', '  Test'],
    ['Trailing spaces', 'TeST  ', 'Test  '],
    ['Hyphenated', 'Test-Person peRson-Person-PERSON', 'Test-Person Person-Person-Person'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'test', 't. test'],
    ['Two words', 'Test Person', 'T. Person'],
    ['Three words', 'Test Test Person', 'T. Person'],
    ['Double barrelled', 'Test-Person Person-Person-Person', 'T. Person-Person-Person'],
  ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe("Check user's role", () => {
  it('should return false if user is null', () => {
    expect(hasRole(null, AuthRole.DECISION_MAKER)).toBe(false)
  })

  it('should return true if user has role', () => {
    const user = { userRoles: [AuthRole.CASE_ADMIN, AuthRole.DECISION_MAKER] } as Express.User
    expect(hasRole(user, AuthRole.CASE_ADMIN)).toBe(true)
  })

  it('should false if user does not have role', () => {
    const user = { userRoles: [] } as Express.User
    expect(hasRole(user, AuthRole.CASE_ADMIN)).toBe(false)
  })
})

describe('Format date', () => {
  it('handles missing date with no default', () => {
    expect(formatDate(null, 'dd MMM yyyy')).toBe(null)
    expect(formatDate(undefined, 'dd MMM yyyy')).toBe(null)
  })

  it('handles missing date with default', () => {
    expect(formatDate(null, 'dd MMM yyyy', 'not provided')).toBe('not provided')
    expect(formatDate(undefined, 'dd MMM yyyy', 'not provided')).toBe('not provided')
  })
})

describe('getOrdinal', () => {
  it('returns the correct ordinal suffix for 1', () => {
    const result = getOrdinal(1)
    expect(result).toBe('1st')
  })

  it('returns the correct ordinal suffix for 2', () => {
    const result = getOrdinal(2)
    expect(result).toBe('2nd')
  })

  it('returns the correct ordinal suffix for 3', () => {
    const result = getOrdinal(3)
    expect(result).toBe('3rd')
  })

  it('returns the correct ordinal suffix for 4', () => {
    const result = getOrdinal(4)
    expect(result).toBe('4th')
  })

  it('returns the correct ordinal suffix for 11', () => {
    const result = getOrdinal(11)
    expect(result).toBe('11th')
  })

  it('returns the correct ordinal suffix for 13', () => {
    const result = getOrdinal(13)
    expect(result).toBe('13th')
  })

  it('returns the correct ordinal suffix for 21', () => {
    const result = getOrdinal(21)
    expect(result).toBe('21st')
  })

  it('returns the correct ordinal suffix for 101', () => {
    const result = getOrdinal(101)
    expect(result).toBe('101st')
  })

  it('returns the correct ordinal suffix for 111', () => {
    const result = getOrdinal(111)
    expect(result).toBe('111th')
  })
})

describe('jsonDtToDateShort', () => {
  it('should convert JSON date to short date format', () => {
    const jsonDate = '2023-10-15T00:00:00.000Z'
    const result = jsonDtToDateShort(jsonDate)
    expect(result).toBe('15 Oct 2023')
  })

  it('should handle different date formats', () => {
    const jsonDate = '2023-01-05T00:00:00.000Z'
    const result = jsonDtToDateShort(jsonDate)
    expect(result).toBe('5 Jan 2023')
  })

  it('should handle invalid date formats gracefully', () => {
    const jsonDate = 'invalid-date'
    const result = jsonDtToDateShort(jsonDate)
    expect(result).toBeNull()
  })

  it('should handle empty date string', () => {
    const jsonDate = ''
    const result = jsonDtToDateShort(jsonDate)
    expect(result).toBeNull()
  })
})
