import type { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from './routes/__testutils/appSetup'
import { ValidationError } from './middleware/setUpValidationMiddleware'

let app: Express

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET 404', () => {
  beforeEach(() => {
    app = appWithAllRoutes({})
  })

  it('should render content with stack in dev mode', () => {
    return request(app)
      .get('/unknown')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('NotFoundError: Not Found')
        expect(res.text).not.toContain('Something went wrong. The error has been logged. Please try again')
      })
  })

  it('should render content without stack in production mode', () => {
    return request(appWithAllRoutes({ production: true }))
      .get('/unknown')
      .expect(404)
      .expect('Content-Type', /html/)
      .expect(res => {
        expect(res.text).toContain('Something went wrong. The error has been logged. Please try again')
        expect(res.text).not.toContain('NotFoundError: Not Found')
      })
  })
})

describe('ValdiationError', () => {
  beforeEach(() => {
    app = appWithAllRoutes({
      middlewareInjector: appToModify => {
        appToModify.post('/some-form', () => {
          throw new ValidationError()
        })
      },
    })
  })

  it('should redirect users back to original form when validation error occurs', () => {
    return request(app)
      .post('/some-form')
      .expect(302)
      .expect('Content-Type', /text\/plain/)
      .expect('Location', '/some-form')
  })
})
