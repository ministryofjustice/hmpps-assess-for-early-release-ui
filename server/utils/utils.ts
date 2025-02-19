import moment from 'moment'
import { parse, format } from 'date-fns'
import AuthRole from '../enumeration/authRole'

const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

const hasRole = (user: Express.User, role: AuthRole): boolean => user?.userRoles.includes(role) || false

const parseIsoDate = (date: string) => {
  return date ? parse(date, 'yyyy-MM-dd', new Date()) : null
}

const toIsoDate = (date: Date) => {
  return date ? format(date, 'yyyy-MM-dd') : null
}

const formatDate = (date: Date, pattern: string, defaultValue: string = null) => {
  return date ? format(date, pattern) : defaultValue
}

const getOrdinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

const jsonDtToDateShort = (dt: string): string => {
  const momentDate = moment(dt)
  return momentDate.isValid() ? momentDate.format('D MMM YYYY') : null
}

export {
  properCase,
  convertToTitleCase,
  initialiseName,
  hasRole,
  parseIsoDate,
  toIsoDate,
  formatDate,
  getOrdinal,
  jsonDtToDateShort,
}
