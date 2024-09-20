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
        ' {{- paths.prison.assessment.initialChecks | toPath({prisonNumber: "A1224"}) -}} ',
        {},
      )
      expect(result).toStrictEqual('/prison/assessment/A1224/initial-checks')
    })

    test('with incorrect args:', () => {
      try {
        renderTemplate(' {{- paths.prison.assessment.initialChecks | toPath({prisonNUMBER: "A1224"}) -}} ', {})
        expect(true).toBe(false)
      } catch (e) {
        expect(e.message).toContain(
          `the path param "prisonNumber" didn't exist on params object {"prisonNUMBER":"A1224"}`,
        )
      }
    })

    test('invalid path:', () => {
      try {
        renderTemplate(' {{- paths.prison.assessment.aaaaaa | toPath({prisonNumber: "A1224"}) -}} ', {})
        expect(true).toBe(false)
      } catch (e) {
        expect(e.message).toContain(`Error: no path provided`)
      }
    })
  })
})
