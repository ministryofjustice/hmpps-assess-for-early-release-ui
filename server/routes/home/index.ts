import { RequestHandler, Router } from 'express'
import { path } from 'static-path'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import HomeRoutes from './handlers/home'

export default function Index(): Router {
  const router = Router()

  const get = (routerPath: string, handler: RequestHandler) => router.get(routerPath, asyncMiddleware(handler))

  const homeHandler = new HomeRoutes()

  const home = path('/')

  get(home({}), homeHandler.GET)

  return router
}
