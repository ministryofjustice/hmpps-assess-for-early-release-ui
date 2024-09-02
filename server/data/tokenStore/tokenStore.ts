import { SystemTokenSupplier } from './systemToken'

export default abstract class TokenStore {
  constructor(private readonly systemTokenSupplier: SystemTokenSupplier) {}

  abstract setToken(key: string, token: string, durationSeconds: number): Promise<void>

  abstract getToken(key: string): Promise<string>

  public getSystemToken = async (username?: string): Promise<string> => {
    const key = username || '%ANONYMOUS%'
    const token = await this.getToken(key)
    if (token) {
      return token
    }

    const systemToken = await this.systemTokenSupplier(username)
    await this.setToken(key, systemToken.token, systemToken.expiresIn - 60)
    return systemToken.token
  }
}
