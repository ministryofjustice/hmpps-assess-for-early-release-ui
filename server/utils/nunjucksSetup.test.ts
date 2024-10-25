import nunjucks from 'nunjucks'
import { registerNunjucks } from './nunjucksSetup'

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
      expect(result).toStrictEqual('/prison/assessment/A1224/initial-checks')
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
      const result = renderTemplate('{{- eligibilityChecks.suitabilityLabel("NOT_STARTED") | dumpJson -}}', {})
      expect(result).toContain(`"text": "Incomplete"`)
      expect(result).toContain(`"classes": "govuk-tag--blue"`)
    })
    test('with SUITABLE:', () => {
      const result = renderTemplate('{{- eligibilityChecks.suitabilityLabel("SUITABLE")  | dumpJson -}}', {})
      expect(result).toContain(`"text": "Completed"`)
    })
    test('with UNSUITABLE:', () => {
      const result = renderTemplate('{{- eligibilityChecks.suitabilityLabel("UNSUITABLE")  | dumpJson -}}', {})
      expect(result).toContain(`"text": "Ineligible"`)
      expect(result).toContain(`"classes": "govuk-tag--red"`)
    })
    test('with unknown:', () => {
      expect(() => renderTemplate('{{- eligibilityChecks.suitabilityLabel("unknown") | dumpJson -}}', {})).toThrow(
        'Error: Unknown status: unknown',
      )
    })
    test('with undefined:', () => {
      expect(() => renderTemplate('{{- eligibilityChecks.suitabilityLabel(undefined) | dumpJson -}}', {})).toThrow(
        'Error: Unknown status: undefined',
      )
    })
  })
})
