import path from 'path'
import compression from 'compression'
import express, { Router } from 'express'
import noCache from 'nocache'

import config from '../config'

export default function setUpStaticResources(): Router {
  const router = express.Router()

  router.use(compression())

  //  Static Resources Configuration
  const cacheControl = { maxAge: config.staticResourceCacheDuration }

  Array.of(
    '/assets',
    '/assets/scss',
    '/assets/js',
    '/dist/assets',
    '/node_modules/govuk-frontend/dist/govuk/assets',
    '/node_modules/govuk-frontend/dist',
    '/node_modules/@ministryofjustice/frontend/moj/assets',
    '/node_modules/@ministryofjustice/frontend',
    '/node_modules/jquery/dist',
  ).forEach(dir => {
    router.use('/assets', express.static(path.join(process.cwd(), dir), cacheControl))
  })
  ;['/node_modules/jquery/dist/jquery.min.js'].forEach(dir => {
    router.use('/assets/js/jquery.min.js', express.static(path.join(process.cwd(), dir), cacheControl))
  })
  ;['/node_modules/jquery-ui-dist/jquery-ui.min.js'].forEach(dir => {
    router.use('/assets/js/jquery-ui.min.js', express.static(path.join(process.cwd(), dir), cacheControl))
  })
  ;['/node_modules/jquery-ui-dist/jquery-ui.min.css'].forEach(dir => {
    router.use('/assets/stylesheets/jquery-ui.min.css', express.static(path.join(process.cwd(), dir), cacheControl))
  })

  // Don't cache dynamic resources
  router.use(noCache())

  return router
}
