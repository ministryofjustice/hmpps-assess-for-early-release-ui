import { Request, Response } from 'express'
import paths from '../../paths'

export default class SupportHomeRoutes {
  GET = async (_: Request, res: Response): Promise<void> => {
    res.render('pages/support/paths', { patterns: this.unfurl(paths) })
  }

  unfurl = (level: Record<string, unknown>) => {
    const response: Record<string, unknown> = {}
    Object.entries(level).forEach(([key, value]) => {
      if (typeof value === 'function' && 'pattern' in value) {
        response[key] = value.pattern
      } else if (typeof value === 'object') {
        response[key] = this.unfurl(value as Record<string, unknown>)
      }
    })
    return response
  }
}
