import AuthRole from '../enumeration/authRole'
import { convertToTitleCase, hasRole, initialiseName, formatDate, getOrdinal } from './utils'

describe('convert to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
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
