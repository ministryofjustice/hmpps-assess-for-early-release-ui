import AuthRole from '../enumeration/authRole'
import { convertToTitleCase, hasRole, initialiseName, formatDate, parseIsoDate } from './utils'

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

  it('formats present date', () => {
    expect(formatDate(parseIsoDate('2020-01-28'), 'dd MMM yyyy')).toBe('28 Jan 2020')
  })

  it('formats present date with present default', () => {
    expect(formatDate(parseIsoDate('2020-01-28'), 'dd MMM yyyy', 'not provided')).toBe('28 Jan 2020')
  })
})
