import type { AvailableComponent, Component } from '@hmpps-components'
import type { HmppsComponentsClient, RestClientBuilder } from '../data'

export default class HmppsComponentsService {
  constructor(private readonly hmppsComponentsClientBuilder: RestClientBuilder<HmppsComponentsClient>) {}

  async getComponents<T extends Array<AvailableComponent>>(
    components: T,
    userToken: string,
  ): Promise<Record<T[number], Component>> {
    const hmppsComponentsClient = this.hmppsComponentsClientBuilder(userToken)

    return hmppsComponentsClient.getComponents(components)
  }
}
