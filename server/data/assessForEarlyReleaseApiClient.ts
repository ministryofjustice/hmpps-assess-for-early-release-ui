import config, { ApiConfig } from '../config'
import RestClient from './hmppsRestClient'
import TokenStore from './tokenStore/tokenStore'

export default class AssessForEarlyReleaseApiClient extends RestClient {
  constructor(tokenStore: TokenStore) {
    super(tokenStore, 'Assess For Early Release API', config.apis.assessForEarlyReleaseApi as ApiConfig)
  }

  async getCaseAdminCaseload() {
    return Promise<[]>
  }
}
