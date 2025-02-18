import nunjucks from 'nunjucks'
import moment from 'moment'
import { startOfDay } from 'date-fns'
import { registerNunjucks } from './nunjucksSetup'
import paths from '../routes/paths'

describe('nunjucksSetup', () => {
  const renderTemplate = (template: string, model: Record<string, unknown>) => {
    const njkEnv = registerNunjucks()
    const compiledTemplate = nunjucks.compile(template, njkEnv)
    return compiledTemplate.render(model)
  }

  describe('toPath', () => {
    test('with correct args:', () => {
      const result = renderTemplate(
        '{{- paths.prison.assessment.initialChecks.tasklist | toPath({prisonNumber: "A1224"}) -}} ',
        {},
      )
      expect(result).toStrictEqual(paths.prison.assessment.initialChecks.tasklist({ prisonNumber: 'A1224' }))
    })

    test('with incorrect args:', () => {
      try {
        renderTemplate('{{- paths.prison.assessment.initialChecks.tasklist | toPath({prisonNUMBER: "A1224"}) -}} ', {})
        expect(true).toBe(false)
      } catch (e) {
        expect(e.message).toContain(
          `the path param "prisonNumber" didn't exist on params object {"prisonNUMBER":"A1224"}`,
        )
      }
    })

    test('invalid path:', () => {
      try {
        renderTemplate('{{- paths.prison.assessment.aaaaaa | toPath({prisonNumber: "A1224"}) -}} ', {})
        expect(true).toBe(false)
      } catch (e) {
        expect(e.message).toContain(`Error: no path provided`)
      }
    })
  })

  describe('coalesce', () => {
    test('with true:', () => {
      const result = renderTemplate('{{- coalesce(itsNull, itsUndefined, itsTrue) -}}', {
        itsNull: null,
        itsUndefined: undefined,
        itsTrue: true,
      })
      expect(result).toStrictEqual('true')
    })
    test('with false:', () => {
      const result = renderTemplate('{{- coalesce(itsNull, itsUndefined, itsFalse) -}}', {
        itsNull: null,
        itsUndefined: undefined,
        itsFalse: false,
      })
      expect(result).toStrictEqual('false')
    })
    test('with empty:', () => {
      const result = renderTemplate('{{- coalesce(itsNull, itsUndefined, itsEmpty) -}}', {
        itsNull: null,
        itsFalse: false,
        itsUndefined: undefined,
        itsEmpty: '',
      })
      expect(result).toStrictEqual('')
    })
    test('takes first non-null value:', () => {
      const result = renderTemplate('{{- coalesce(null, undefined, 1, 2) -}}', {
        itsNull: null,
        itsUndefined: undefined,
        itsTrue: true,
      })
      expect(result).toStrictEqual('1')
    })
  })

  describe('find', () => {
    test('when undefined array:', () => {
      const result = renderTemplate('{{- values | find("name", "bbb") -}}', {})
      expect(result).toStrictEqual('')
    })
    test('when found:', () => {
      const result = renderTemplate('{% set a = values | find("name", "bbb") %}{{a.age}}', {
        values: [
          { name: 'aaa', age: 10 },
          { name: 'bbb', age: 20 },
          { name: 'ccc', age: 30 },
        ],
      })
      expect(result).toStrictEqual('20')
    })
    test('when not found:', () => {
      const result = renderTemplate('{{- values | find("name", "ddd") -}}', {
        values: [
          { name: 'aaa', age: 10 },
          { name: 'bbb', age: 20 },
          { name: 'ccc', age: 30 },
        ],
      })
      expect(result).toStrictEqual('')
    })
  })

  describe('filter', () => {
    test('when undefined array:', () => {
      const result = renderTemplate('{{- values | filter("name", "bbb") -}}', {})
      expect(result).toStrictEqual('')
    })
    test('when found:', () => {
      const result = renderTemplate('{{ values | filter("age", 10) | length -}}', {
        values: [
          { name: 'aaa', age: 10 },
          { name: 'bbb', age: 20 },
          { name: 'ccc', age: 10 },
        ],
      })
      expect(result).toStrictEqual('2')
    })
    test('when not found:', () => {
      const result = renderTemplate('{{- values | filter("name", "ddd") -}}', {
        values: [
          { name: 'aaa', age: 10 },
          { name: 'bbb', age: 20 },
          { name: 'ccc', age: 30 },
        ],
      })
      expect(result).toStrictEqual('')
    })
  })

  describe('attr', () => {
    test('when undefined array:', () => {
      const result = renderTemplate('{{- values | filter("name", "bbb") -}}', {})
      expect(result).toStrictEqual('')
    })
    test('when exists:', () => {
      const result = renderTemplate('{{ values | attr("name") | join(" - ") -}}', {
        values: [
          { name: 'aaa', age: 10 },
          { name: 'bbb', age: 20 },
          { name: 'ccc', age: 10 },
        ],
      })
      expect(result).toStrictEqual('aaa - bbb - ccc')
    })
    test('when does not exist:', () => {
      const result = renderTemplate('{{- values | attr("colour") | join(" ") | trim  -}}', {
        values: [
          { name: 'aaa', age: 10 },
          { name: 'bbb', age: 20 },
          { name: 'ccc', age: 30 },
        ],
      })
      expect(result).toStrictEqual('')
    })
  })

  describe('toFullName', () => {
    test('when does not exist:', () => {
      expect(() => renderTemplate('{{- value | toFullName -}}', {})).toThrow()
    })
    test('when undefined array:', () => {
      const result = renderTemplate('{{- value | toFullName -}}', {
        value: { forename: 'JIM', surname: 'SMITH-BOOTH' },
      })
      expect(result).toStrictEqual('Jim Smith-Booth')
    })
  })

  describe('safeToString', () => {
    test('with undefinded:', () => {
      const result = renderTemplate('{{- undefined | safeToString -}}', {})
      expect(result).toStrictEqual('')
    })
    test('with empty:', () => {
      const result = renderTemplate('{{- "" | safeToString -}}', {})
      expect(result).toStrictEqual('')
    })
    test('with null:', () => {
      const result = renderTemplate('{{- null | safeToString -}}', {})
      expect(result).toStrictEqual('')
    })
    test('with true:', () => {
      const result = renderTemplate('{{- true | safeToString -}}', {})
      expect(result).toStrictEqual('true')
    })
    test('with false:', () => {
      const result = renderTemplate('{{- false | safeToString -}}', {})
      expect(result).toStrictEqual('false')
    })
    test('with 0:', () => {
      const result = renderTemplate('{{- 0 | safeToString -}}', {})
      expect(result).toStrictEqual('0')
    })
  })

  describe('eligibilityLabel', () => {
    test('with NOT_STARTED:', () => {
      const result = renderTemplate('{{- eligibilityChecks.eligibilityLabel("NOT_STARTED") | dumpJson -}}', {})
      expect(result).toContain(`"text": "Incomplete"`)
      expect(result).toContain(`"classes": "govuk-tag--blue"`)
    })
    test('with ELIGIBLE:', () => {
      const result = renderTemplate('{{- eligibilityChecks.eligibilityLabel("ELIGIBLE")  | dumpJson -}}', {})
      expect(result).toContain(`"text": "Completed"`)
    })
    test('with INELIGIBLE:', () => {
      const result = renderTemplate('{{- eligibilityChecks.eligibilityLabel("INELIGIBLE")  | dumpJson -}}', {})
      expect(result).toContain(`"text": "Ineligible"`)
      expect(result).toContain(`"classes": "govuk-tag--red"`)
    })
    test('with unknown:', () => {
      expect(() => renderTemplate('{{- eligibilityChecks.eligibilityLabel("unknown") | dumpJson -}}', {})).toThrow(
        'Error: Unknown status: unknown',
      )
    })
    test('with undefined:', () => {
      expect(() => renderTemplate('{{- eligibilityChecks.eligibilityLabel(undefined) | dumpJson -}}', {})).toThrow(
        'Error: Unknown status: undefined',
      )
    })
  })
  describe('suitabilityLabel', () => {
    test('with NOT_STARTED:', () => {
      const result = renderTemplate('{{- eligibilityChecks.suitabilityLabel(false, "NOT_STARTED") | dumpJson -}}', {})
      expect(result).toContain(`"text": "Incomplete"`)
      expect(result).toContain(`"classes": "govuk-tag--blue"`)
    })
    test('with SUITABLE:', () => {
      const result = renderTemplate('{{- eligibilityChecks.suitabilityLabel(false, "SUITABLE")  | dumpJson -}}', {})
      expect(result).toContain(`"text": "Completed"`)
    })
    test('with UNSUITABLE:', () => {
      const result = renderTemplate('{{- eligibilityChecks.suitabilityLabel(false, "UNSUITABLE")  | dumpJson -}}', {})
      expect(result).toContain(`"text": "Ineligible"`)
      expect(result).toContain(`"classes": "govuk-tag--red"`)
    })
    test('with unknown:', () => {
      expect(() =>
        renderTemplate('{{- eligibilityChecks.suitabilityLabel(false, "unknown") | dumpJson -}}', {}),
      ).toThrow('Error: Unknown status: unknown')
    })
    test('with undefined:', () => {
      expect(() =>
        renderTemplate('{{- eligibilityChecks.suitabilityLabel(false, undefined) | dumpJson -}}', {}),
      ).toThrow('Error: Unknown status: undefined')
    })
    test('when blocked from starting:', () => {
      const result = renderTemplate('{{- eligibilityChecks.suitabilityLabel(true, "NOT_STARTED")  | dumpJson -}}', {})
      expect(result).toContain(`"text": "Cannot start yet"`)
    })
  })

  describe('residentialCheckTaskLabel', () => {
    test('with NOT_STARTED:', () => {
      const result = renderTemplate('{{- residentialChecks.taskStatusLabel("NOT_STARTED") | dumpJson -}}', {})
      expect(result).toContain(`"text": "Incomplete"`)
      expect(result).toContain(`"classes": "govuk-tag--blue"`)
    })
    test('with SUITABLE:', () => {
      const result = renderTemplate('{{- residentialChecks.taskStatusLabel("SUITABLE")  | dumpJson -}}', {})
      expect(result).toContain(`"text": "Completed"`)
    })
    test('with UNSUITABLE:', () => {
      const result = renderTemplate('{{- residentialChecks.taskStatusLabel("UNSUITABLE")  | dumpJson -}}', {})
      expect(result).toContain(`"text": "Ineligible"`)
      expect(result).toContain(`"classes": "govuk-tag--red"`)
    })
    test('with unknown:', () => {
      expect(() => renderTemplate('{{- residentialChecks.taskStatusLabel("unknown") | dumpJson -}}', {})).toThrow(
        'Error: Unknown status: unknown',
      )
    })
    test('with undefined:', () => {
      expect(() => renderTemplate('{{- residentialChecks.taskStatusLabel(undefined) | dumpJson -}}', {})).toThrow(
        'Error: Unknown status: undefined',
      )
    })
  })

  describe('toAddressView & valuesToList', () => {
    test('should return firstLine, secondLine, town, postcode from addressSummary as string format', () => {
      const result = renderTemplate('{{- addressSummary | toAddressView | valuesToList -}}', {
        addressSummary: {
          uprn: '310030567',
          firstLine: '99, HARTLAND ROAD',
          secondLine: '',
          town: 'READING',
          county: 'READING',
          postcode: 'RG2 8AF',
          country: 'England',
          xcoordinate: 472231.0,
          ycoordinate: 170070.0,
          addressLastUpdated: new Date('2020-06-25'),
        },
      })

      expect(result).toEqual('99, HARTLAND ROAD, READING, RG2 8AF')
    })
  })

  describe('Date utility functions', () => {
    describe('getDay', () => {
      it('returns the day of the month as a two-digit string', () => {
        const date = new Date('2023-10-15')
        const result = renderTemplate('{{- date | getDay -}}', {
          date,
        })
        expect(result).toBe('15')
      })

      it('pads single-digit days with a leading zero', () => {
        const date = new Date('2023-10-05')
        const result = renderTemplate('{{- date | getDay -}}', {
          date,
        })
        expect(result).toBe('05')
      })
    })

    describe('getMonth', () => {
      it('returns the month as a two-digit string', () => {
        const date = new Date('2023-10-15')
        const result = renderTemplate('{{- date | getMonth -}}', {
          date,
        })
        expect(result).toBe('10')
      })

      it('pads single-digit months with a leading zero', () => {
        const date = new Date('2023-01-15')
        const result = renderTemplate('{{- date | getMonth -}}', {
          date,
        })
        expect(result).toBe('01')
      })
    })

    describe('getYear', () => {
      it('returns the year as a four-digit string', () => {
        const date = new Date('2023-10-15')
        const result = renderTemplate('{{- date | getYear -}}', {
          date,
        })
        expect(result).toBe('2023')
      })
    })
  })

  fdescribe('isTaskOverdue', () => {
    it('should return true if taskOverdueOn is less than today', () => {
      const taskOverdueOn = startOfDay(moment().subtract(1, 'days').toISOString()) // Set to yesterday
      const result = renderTemplate('{{- taskOverdueOn | isTaskOverdue -}}', { taskOverdueOn })
      expect(result).toStrictEqual('true')
    })

    it('should return false if taskOverdueOn is today', () => {
      const taskOverdueOn = moment().toISOString()
      const result = renderTemplate('{{- taskOverdueOn | isTaskOverdue -}}', { taskOverdueOn })
      expect(result).toStrictEqual('false')
    })

    it('should return false if taskOverdueOn is greater than today', () => {
      const taskOverdueOn = moment().add(1, 'days').toISOString() // Set to tomorrow
      const result = renderTemplate('{{- taskOverdueOn | isTaskOverdue -}}', { taskOverdueOn })
      expect(result).toStrictEqual('false')
    })

    it('should return false if taskOverdueOn is null', () => {
      const result = renderTemplate('{{- null | isTaskOverdue -}}', {})
      expect(result).toStrictEqual('false')
    })
  })
})
