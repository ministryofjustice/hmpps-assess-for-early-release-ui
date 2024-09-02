import HmppsAuthClient from './hmppsAuthClient'
import { createRedisClient } from './redisClient'
import RedisTokenStore from './tokenStore/redisTokenStore'
import InMemoryTokenStore from './tokenStore/inMemoryTokenStore'
import config from '../config'
import HmppsAuditClient from './hmppsAuditClient'
import HmppsComponentsClient from './hmppsComponentsClient'
import { getSystemToken, getSystemTokenWithRetries } from './tokenStore/systemToken'
import AssessForEarlyReleaseApiClient from './assessForEarlyReleaseApiClient'

type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => {
  const redisClient = createRedisClient()

  const tokenStore = new RedisTokenStore(getSystemToken, redisClient)

  return {
    hmppsAuthClient: new HmppsAuthClient(
      config.redis.enabled
        ? new RedisTokenStore(getSystemToken, createRedisClient())
        : new InMemoryTokenStore(getSystemTokenWithRetries),
    ),
    hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
    assessForEarlyReleaseApiClient: new AssessForEarlyReleaseApiClient(tokenStore),
  }
}

const hmppsComponentsClientBuilder: RestClientBuilder<HmppsComponentsClient> = (userToken: Express.User['token']) =>
  new HmppsComponentsClient(userToken)

export type DataAccess = ReturnType<typeof dataAccess>

export { HmppsAuthClient, RestClientBuilder, HmppsAuditClient, HmppsComponentsClient, hmppsComponentsClientBuilder }
