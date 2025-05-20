import generateOauthClientToken from './clientCredentials'

describe('generateOauthClientToken', () => {
  it('Token can be generated', () => {
    expect(generateOauthClientToken('test', 'password1')).toBe('Basic dGVzdDpwYXNzd29yZDE=')
  })

  it('Token can be generated with special characters', () => {
    const value = generateOauthClientToken('test', "p@'s&sw/o$+ rd1")
    const decoded = Buffer.from(value.substring(6), 'base64').toString('utf-8')

    expect(decoded).toBe("test:p@'s&sw/o$+ rd1")
  })
})
