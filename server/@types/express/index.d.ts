import { HmppsUser } from '../../interfaces/hmppsUser'

export declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
  }
}

export declare global {
  namespace Express {
    interface User {
      username: string
      token: string
      authSource: string
      userRoles: string[]
    }

    interface Request {
      verified?: boolean
      id: string
      middleware?: {
        clientToken?: string
      }
      logout(done: (err: unknown) => void): void
      flash(type: string, message: unknown): unknown
    }

    interface Locals {
      user: HmppsUser
    }
  }
}
