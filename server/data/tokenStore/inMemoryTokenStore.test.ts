import TokenStore from './inMemoryTokenStore'
import { SystemToken, SystemTokenSupplier } from './systemToken'

const systemTokenSupplier = () => Promise<SystemToken>

describe('inMemoryTokenStore', () => {
  let tokenStore: TokenStore

  beforeEach(() => {
    tokenStore = new TokenStore(systemTokenSupplier as unknown as SystemTokenSupplier)
  })

  it('Can store and retrieve token', async () => {
    await tokenStore.setToken('user-1', 'token-1', 10)
    expect(await tokenStore.getToken('user-1')).toBe('token-1')
  })

  it('Expires token', async () => {
    await tokenStore.setToken('user-2', 'token-2', -1)
    expect(await tokenStore.getToken('user-2')).toBe(null)
  })
})
