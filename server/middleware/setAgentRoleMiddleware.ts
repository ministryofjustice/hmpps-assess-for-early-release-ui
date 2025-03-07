import { RequestHandler } from 'express'

export default function setAgentRole(role: string): RequestHandler {
  return async (req, res, next) => {
    res.locals.agent = {
      ...res.locals.agent,
      role,
    }
    next()
  }
}
