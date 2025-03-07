import HmppsAuthClient from './hmppsAuthClient'
import { createRedisClient } from './redisClient'
import RedisTokenStore from './tokenStore/redisTokenStore'
import InMemoryTokenStore from './tokenStore/inMemoryTokenStore'
import config from '../config'
import HmppsAuditClient from './hmppsAuditClient'
import HmppsComponentsClient from './hmppsComponentsClient'
import AssessForEarlyReleaseApiClient from './assessForEarlyReleaseApiClient'
import { Agent } from '../@types/assessForEarlyReleaseApiClientTypes'

type RestClientBuilder<T> = (token: string, agent: Agent) => T

export const dataAccess = {
  hmppsAuthClient: new HmppsAuthClient(
    config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore(),
  ),
  hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
  assessForEarlyReleaseApiClientBuilder: (token: string, agent: Agent) =>
    new AssessForEarlyReleaseApiClient(token, agent),
}

const hmppsComponentsClientBuilder: RestClientBuilder<HmppsComponentsClient> = (userToken: Express.User['token']) =>
  new HmppsComponentsClient(userToken)

export type DataAccess = typeof dataAccess

export {
  HmppsAuthClient,
  RestClientBuilder,
  HmppsAuditClient,
  HmppsComponentsClient,
  hmppsComponentsClientBuilder,
  AssessForEarlyReleaseApiClient,
}
