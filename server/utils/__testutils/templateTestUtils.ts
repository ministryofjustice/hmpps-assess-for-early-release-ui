// eslint-disable-next-line import/no-extraneous-dependencies
import * as cheerio from 'cheerio'
import nunjucks from 'nunjucks'
import { registerNunjucks } from '../nunjucksSetup'

export const renderTemplate = (template: string, model: Record<string, unknown>, debug = false) => {
  const njkEnv = registerNunjucks()
  const compiledTemplate = nunjucks.compile(template, njkEnv)
  const renderedHtml = compiledTemplate.render(model)
  if (debug) {
    // eslint-disable-next-line no-console
    console.log(renderedHtml)
  }
  return cheerio.load(renderedHtml)
}

export const templateRenderer = (template: string) => (model: Record<string, unknown>) =>
  renderTemplate(template, model)
