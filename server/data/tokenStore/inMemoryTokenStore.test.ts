import TokenStore from './inMemoryTokenStore'

describe('inMemoryTokenStore', () => {
  let tokenStore: TokenStore
  const token = { token: 'token-1', expiresIn: 1234 }

  beforeEach(() => {
    tokenStore = new TokenStore(async _username => token)
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
