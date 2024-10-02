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
})
