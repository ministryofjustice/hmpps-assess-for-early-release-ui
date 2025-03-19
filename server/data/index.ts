import {
  AuthenticationClient,
  InMemoryTokenStore,
  RedisTokenStore,
  VerificationClient,
} from '@ministryofjustice/hmpps-auth-clients'
import { createRedisClient } from './redisClient'

import config from '../config'
import HmppsAuditClient from './hmppsAuditClient'
import HmppsComponentsClient from './hmppsComponentsClient'
import AssessForEarlyReleaseApiClient from './assessForEarlyReleaseApiClient'
import logger from '../../logger'

const tokenStore = config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore()
const authClient = new AuthenticationClient(config.apis.hmppsAuth, logger, tokenStore)

export const dataAccess = {
  authClient,
  hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
  assessForEarlyReleaseApiClient: new AssessForEarlyReleaseApiClient(authClient),
  hmppsComponentsClient: new HmppsComponentsClient(authClient),
  verificationClient: new VerificationClient(config.apis.tokenVerification, logger),
}

export type DataAccess = typeof dataAccess

export {
  HmppsAuditClient,
  AuthenticationClient,
  HmppsComponentsClient,
  AssessForEarlyReleaseApiClient,
  VerificationClient,
}
