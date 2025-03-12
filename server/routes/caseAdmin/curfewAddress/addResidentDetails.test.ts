import {
  createAgent,
  createAssessmentSummary,
  createStandardAddressCheckRequestSummary,
} from '../../../data/__testutils/testObjects'
import { mockRequest, mockResponse } from '../../__testutils/requestTestUtils'
import { createMockAddressService, createMockCaseAdminCaseloadService } from '../../../services/__testutils/mock'
import { ValidationError } from '../../../middleware/setUpValidationMiddleware'
import paths from '../../paths'
import AddResidentDetailsRoutes, { OtherResident } from './addResidentDetails'
import { _ResidentSummary } from '../../../@types/assessForEarlyReleaseApiClientTypes'

const assessmentSummary = createAssessmentSummary({})
const addressCheckRequestSummary = createStandardAddressCheckRequestSummary({})

const addressService = createMockAddressService()
const caseAdminCaseloadService = createMockCaseAdminCaseloadService()
const req = mockRequest({})
const res = mockResponse({})
res.locals.agent = createAgent()

describe('add resident details routes', () => {
  let addResidentDetailsRoutes: AddResidentDetailsRoutes

  beforeEach(() => {
    addResidentDetailsRoutes = new AddResidentDetailsRoutes(addressService, caseAdminCaseloadService)
    addressService.getStandardAddressCheckRequest.mockResolvedValue(addressCheckRequestSummary)
    caseAdminCaseloadService.getAssessmentSummary.mockResolvedValue(assessmentSummary)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('GET', () => {
    it('should render add resident details ', async () => {
      req.params.prisonNumber = assessmentSummary.prisonNumber
      req.params.checkRequestId = '693'
      await addResidentDetailsRoutes.GET(req, res)

      expect(caseAdminCaseloadService.getAssessmentSummary).toHaveBeenCalledWith(
        req.middleware.clientToken,
        res.locals.agent,
        req.params.prisonNumber,
      )

      expect(addressService.getStandardAddressCheckRequest).toHaveBeenCalledWith(
        req?.middleware?.clientToken,
        res.locals.agent,
        req.params.prisonNumber,
        Number(req.params.checkRequestId),
      )
      expect(res.render).toHaveBeenCalledWith('pages/curfewAddress/addResidentDetails', {
        assessmentSummary,
        address: {
          line1: '99, Hartland Road',
          postcode: 'RG2 8AF',
          town: 'Reading',
        },
        mainResident: addressCheckRequestSummary.residents[0],
        otherResidents: [],
      })
    })
  })

  describe('POST', () => {
    it('validates POST request contains resident details', async () => {
      req.params.prisonNumber = assessmentSummary.prisonNumber
      req.params.checkRequestId = '693'
      req.body.isOffender = false
      await expect(addResidentDetailsRoutes.POST(req, res)).rejects.toThrow(ValidationError)
    })
    it('add a resident for a valid POST request', async () => {
      req.params.prisonNumber = assessmentSummary.prisonNumber
      req.params.checkRequestId = '693'
      req.body.forename = 'Corina'
      req.body.surname = 'Ridgeway'
      req.body.relation = 'sister'
      req.body.residentId = 1
      req.body.phoneNumber = '3434567890'
      req.body.isOffender = false
      req.body.otherResident = [
        {
          day: '11',
          month: '01',
          year: '1985',
          residentId: 2,
          forename: 'James',
          surname: 'Bluff',
          relation: 'brother',
          age: 89,
          isMainResident: false,
        },
      ]
      const { residentId, forename, surname, phoneNumber, relation } = req.body
      const mainResident = {
        residentId,
        forename,
        surname,
        phoneNumber,
        relation,
        isMainResident: true,
        isOffender: false,
      } as _ResidentSummary
      const otherResident = {
        residentId: req.body.otherResident[0].residentId,
        forename: req.body.otherResident[0].forename,
        surname: req.body.otherResident[0].surname,
        relation: req.body.otherResident[0].relation,
        dateOfBirth: '1985-01-11',
        age: req.body.otherResident[0].age,
        isOffender: false,
        isMainResident: false,
      }
      await addResidentDetailsRoutes.POST(req, res)
      expect(addressService.addResidents).toHaveBeenCalledWith(
        req?.middleware?.clientToken,
        res.locals.agent,
        req.params.prisonNumber,
        Number(req.params.checkRequestId),
        [mainResident, otherResident],
      )
      expect(res.redirect).toHaveBeenCalledWith(
        `${paths.prison.assessment.enterCurfewAddressOrCasArea.moreInformationRequiredCheck({ prisonNumber: req.params.prisonNumber, checkRequestId: req.params.checkRequestId })}`,
      )
    })

    it('add a main resident as offender for a valid POST request', async () => {
      req.params.prisonNumber = assessmentSummary.prisonNumber
      req.params.checkRequestId = '693'
      req.body.residentId = 1
      req.body.isOffender = true
      req.body.prisonerName = 'Jim Smith'
      req.body.otherResident = []
      const { residentId, isOffender, prisonerName } = req.body
      const mainResident = {
        residentId,
        forename: prisonerName.split(' ')[0],
        surname: prisonerName.split(' ')[1],
        phoneNumber: null,
        relation: null,
        isMainResident: true,
        isOffender,
      } as _ResidentSummary
      await addResidentDetailsRoutes.POST(req, res)
      expect(addressService.addResidents).toHaveBeenCalledWith(
        req?.middleware?.clientToken,
        res.locals.agent,
        req.params.prisonNumber,
        Number(req.params.checkRequestId),
        [mainResident],
      )
      expect(res.redirect).toHaveBeenCalledWith(
        `${paths.prison.assessment.enterCurfewAddressOrCasArea.moreInformationRequiredCheck({ prisonNumber: req.params.prisonNumber, checkRequestId: req.params.checkRequestId })}`,
      )
    })
  })

  describe('transformToResidentSummary', () => {
    it('transforms valid otherResident data to ResidentSummary', () => {
      const otherResident = {
        residentId: 2,
        forename: 'James',
        surname: 'Bluff',
        relation: 'brother',
        day: '11',
        month: '01',
        year: '1985',
        age: 89,
      }

      const expectedResidentSummary = {
        residentId: 2,
        forename: 'James',
        surname: 'Bluff',
        relation: 'brother',
        dateOfBirth: '1985-01-11',
        age: 89,
        isMainResident: false,
        isOffender: false,
      }

      const result = addResidentDetailsRoutes.transformToResidentSummary(otherResident as OtherResident)
      expect(result).toEqual(expectedResidentSummary)
    })
  })
})
