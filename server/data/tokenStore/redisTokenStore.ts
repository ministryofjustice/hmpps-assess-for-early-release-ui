import type { RedisClient } from '../redisClient'

import logger from '../../../logger'
import TokenStore from './tokenStore'
import { SystemTokenSupplier } from './systemToken'

export default class RedisTokenStore extends TokenStore {
  private readonly prefix = 'systemToken:'

  constructor(
    systemTokenSupplier: SystemTokenSupplier,
    private readonly client: RedisClient,
  ) {
    super(systemTokenSupplier)
    client.on('error', error => {
      logger.error(error, `Redis error`)
    })
  }

  private async ensureConnected() {
    if (!this.client.isOpen) {
      await this.client.connect()
    }
  }

  public async setToken(key: string, token: string, durationSeconds: number): Promise<void> {
    await this.ensureConnected()
    await this.client.set(`${this.prefix}${key}`, token, { EX: durationSeconds })
  }

  public async getToken(key: string): Promise<string> {
    await this.ensureConnected()
    return this.client.get(`${this.prefix}${key}`)
  }
}
