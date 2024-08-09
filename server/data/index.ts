import HmppsAuthClient from './hmppsAuthClient'
import { createRedisClient } from './redisClient'
import RedisTokenStore from './tokenStore/redisTokenStore'
import InMemoryTokenStore from './tokenStore/inMemoryTokenStore'
import config from '../config'
import HmppsAuditClient from './hmppsAuditClient'
import HmppsComponentsClient from './hmppsComponentsClient'

type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => ({
  hmppsAuthClient: new HmppsAuthClient(
    config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore(),
  ),
  hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
})

const hmppsComponentsClientBuilder: RestClientBuilder<HmppsComponentsClient> = (userToken: Express.User['token']) =>
  new HmppsComponentsClient(userToken)

export type DataAccess = ReturnType<typeof dataAccess>

export { HmppsAuthClient, RestClientBuilder, HmppsAuditClient, HmppsComponentsClient, hmppsComponentsClientBuilder }
