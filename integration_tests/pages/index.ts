import Page from './page'

export default class IndexPage extends Page {
  constructor() {
    super('Assess For Early Release')
  }

  fallbackHeaderUserName = (): Cypress.Chainable<JQuery> => cy.get('[data-qa=header-user-name]')

  commonComponentsHeader = (): Cypress.Chainable<JQuery> => cy.get('h1').contains('Common Components Header')

  commonComponentsFooter = (): Cypress.Chainable<JQuery> => cy.get('h1').contains('Common Components Footer')
}
