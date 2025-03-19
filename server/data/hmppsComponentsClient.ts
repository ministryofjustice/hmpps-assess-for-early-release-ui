import type { AvailableComponent, Component } from '@hmpps-components'
import { AuthenticationClient, RestClient } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../../logger'

export default class HmppsComponentsClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('hmppsComponentsClient', config.apis.hmppsComponents, logger, authenticationClient)
  }

  async getComponents<T extends Array<AvailableComponent>>(
    token: string,
    components: T,
  ): Promise<Record<T[number], Component>> {
    return this.get({
      headers: { 'x-user-token': token },
      path: '/components',
      query: `component=${components.join('&component=')}`,
    }) as Promise<Record<T[number], Component>>
  }
}
