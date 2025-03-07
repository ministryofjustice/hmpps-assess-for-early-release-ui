import type { AvailableComponent, Component } from '@hmpps-components'
import type { HmppsComponentsClient, RestClientBuilder } from '../data'
import { Agent } from '../@types/assessForEarlyReleaseApiClientTypes'

export default class HmppsComponentsService {
  constructor(private readonly hmppsComponentsClientBuilder: RestClientBuilder<HmppsComponentsClient>) {}

  async getComponents<T extends Array<AvailableComponent>>(
    components: T,
    userToken: string,
    agent: Agent,
  ): Promise<Record<T[number], Component>> {
    const hmppsComponentsClient = this.hmppsComponentsClientBuilder(userToken, agent)

    return hmppsComponentsClient.getComponents(components)
  }
}
