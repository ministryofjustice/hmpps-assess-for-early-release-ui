import config, { ApiConfig } from '../config'
import RestClient from './hmppsRestClient'
import TokenStore from './tokenStore/tokenStore'

export default class DecisionMakerApiClient extends RestClient {
  constructor(tokenStore: TokenStore) {
    super(tokenStore, 'DM API', config.apis.decisionMakerApi as ApiConfig)
  }

  async assessOffender() {
    return Promise<[]>
  }
}
