import config, { ApiConfig } from '../config'
import RestClient from './hmppsRestClient'
import TokenStore from './tokenStore/tokenStore'

export default class AssessApiClient extends RestClient {
  constructor(tokenStore: TokenStore) {
    super(tokenStore, 'Licence API', config.apis.assessLicenceApi as ApiConfig)
  }

  async assessOffender(user: Express.User) {
    return Promise<[]>
    // return (await this.post({ path: `/licence/id/edit` }, { username: user?.username })) as Promise<[]>
  }
}
