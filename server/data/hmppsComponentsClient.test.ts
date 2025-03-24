import nock from 'nock'

import type { Component } from '@hmpps-components'
import HmppsComponentsClient from './hmppsComponentsClient'
import config from '../config'

describe('hmppsComponentsClient', () => {
  let fakeComponentsApi: nock.Scope
  let hmppsComponentsClient: HmppsComponentsClient
  const token = 'token-1'

  beforeEach(() => {
    fakeComponentsApi = nock(config.apis.hmppsComponents.url)
    hmppsComponentsClient = new HmppsComponentsClient(null)
  })

  afterEach(() => {
    jest.resetAllMocks()
    nock.cleanAll()
  })

  describe('getComponents', () => {
    it('should return data from api', async () => {
      const response: { data: { footer: Component; header: Component } } = {
        data: {
          footer: {
            css: [],
            html: '<footer></footer>',
            javascript: [],
          },
          header: {
            css: [],
            html: '<header></header>',
            javascript: [],
          },
        },
      }

      fakeComponentsApi
        .get('/components?component=header&component=footer')
        .matchHeader('x-user-token', token)
        .reply(200, response)

      const output = await hmppsComponentsClient.getComponents(token, ['header', 'footer'])
      expect(output).toEqual(response)
    })
  })
})
