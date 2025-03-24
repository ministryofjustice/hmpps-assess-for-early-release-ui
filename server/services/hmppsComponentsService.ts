import type { AvailableComponent, Component } from '@hmpps-components'
import type { HmppsComponentsClient } from '../data'

export default class HmppsComponentsService {
  constructor(private readonly hmppsComponentsClient: HmppsComponentsClient) {}

  async getComponents<T extends Array<AvailableComponent>>(
    components: T,
    userToken: string,
  ): Promise<Record<T[number], Component>> {
    return this.hmppsComponentsClient.getComponents(userToken, components)
  }
}
