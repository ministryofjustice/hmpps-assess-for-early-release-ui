import { parseIsoDate, toIsoDate } from './utils'

function validDateFormFields(namePrefix: string, reqBody: Record<string, string>): boolean {
  const day = reqBody[`${namePrefix}-day`]
  const month = reqBody[`${namePrefix}-month`]
  const year = reqBody[`${namePrefix}-year`]

  if (!day || !isPositiveInteger(day) || !month || !isPositiveInteger(month) || !year || !isPositiveInteger(year)) {
    return undefined
  }

  const numericDay = parseInt(day, 10)
  const numericMonth = parseInt(month, 10)
  return !(numericDay > 31 || numericMonth > 12)
}

function isPositiveInteger(value: string): boolean {
  const isNumeric = /^\d+$/.test(value)
  if (!isNumeric) {
    return false
  }
  const numericValue = parseInt(value, 10)
  return !Number.isNaN(numericValue) && numericValue > 0
}

function getFormDate(namePrefix: string, reqBody: Record<string, string>): string {
  if (validDateFormFields(namePrefix, reqBody)) {
    return toIsoDate(
      parseIsoDate(
        `${reqBody[`${namePrefix}-year`]}-${reqBody[`${namePrefix}-month`]}-${reqBody[`${namePrefix}-day`]}`,
      ),
    )
  }
  return undefined
}

export default getFormDate
