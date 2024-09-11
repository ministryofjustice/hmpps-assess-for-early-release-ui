import { Request, Response } from 'express'

import HomeRoutes from './home'
import AuthRole from '../../../enumeration/authRole'

describe('Route Handlers - Home', () => {
  const handler = new HomeRoutes()
  let req: Request
  let res: Response

  beforeEach(() => {
    res = {
      render: jest.fn(),
    } as unknown as Response
  })

  describe('GET', () => {
    describe('For support admin role', () => {
      it('With wrong auth role', async () => {
        req = getReqWithRolesAndSource([AuthRole.DECISION_MAKER], 'nomis')
        await handler.GET(req, res)
        expect(res.render).toHaveBeenCalledWith('pages/index', {
          shouldShowSupportCard: false,
          shouldShowAssessForHDCCard: false,
        })
      })

      it('With correct auth role', async () => {
        req = getReqWithRolesAndSource([AuthRole.SUPPORT, AuthRole.CASE_ADMIN], 'nomis')
        await handler.GET(req, res)
        expect(res.render).toHaveBeenCalledWith('pages/index', {
          shouldShowSupportCard: true,
          shouldShowAssessForHDCCard: true,
        })
      })
    })
  })
})

const getReqWithRolesAndSource = (roles: string[], authSource: string): Request => {
  return {
    user: {
      userRoles: roles,
      authSource,
    },
  } as unknown as Request
}
