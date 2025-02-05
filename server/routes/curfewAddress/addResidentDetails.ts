import { Request, Response } from 'express'
import { AddressService, CaseAdminCaseloadService } from '../../services'
import { convertToTitleCase, getOrdinal } from '../../utils/utils'
import { validateRequest } from '../../middleware/setUpValidationMiddleware'
import { FieldValidationError } from '../../@types/FieldValidationError'
import { _ResidentSummary } from '../../@types/assessForEarlyReleaseApiClientTypes'
import paths from '../paths'

export interface OtherResident extends _ResidentSummary {
  day: string
  month: string
  year: string
}

export default class AddResidentDetailsRoutes {
  constructor(
    private readonly addressService: AddressService,
    private readonly caseAdminCaseloadService: CaseAdminCaseloadService,
  ) {}

  GET = async (req: Request, res: Response): Promise<void> => {
    const { checkRequestId, prisonNumber } = req.params
    const assessmentSummary = await this.caseAdminCaseloadService.getAssessmentSummary(
      req?.middleware?.clientToken,
      prisonNumber,
    )

    const requestSummary = await this.addressService.getStandardAddressCheckRequest(
      req?.middleware?.clientToken,
      prisonNumber,
      Number(checkRequestId),
    )

    const mainResident: _ResidentSummary = requestSummary.residents.find(
      (resident: _ResidentSummary) => resident.isMainResident,
    )
    const otherResidents: _ResidentSummary[] = requestSummary.residents.filter(
      (resident: _ResidentSummary) => !resident.isMainResident,
    )

    res.render('pages/curfewAddress/addResidentDetails', {
      assessmentSummary: {
        ...assessmentSummary,
        name: convertToTitleCase(`${assessmentSummary.forename} ${assessmentSummary.surname}`.trim()),
      },
      address: {
        line1: convertToTitleCase(requestSummary.address.firstLine),
        town: convertToTitleCase(requestSummary.address.town),
        postcode: requestSummary.address.postcode,
      },
      mainResident,
      otherResidents,
    })
  }

  POST = async (req: Request, res: Response): Promise<void> => {
    const { checkRequestId, prisonNumber } = req.params
    const { residentId, forename, surname, phoneNumber, relation, prisonerName, otherResident } = req.body

    validateRequest(req, () => {
      const validationErrors: FieldValidationError[] = []

      if (!forename) {
        validationErrors.push({ field: 'forename', message: 'Enter the main occupier’s first name' })
      }

      if (!surname) {
        validationErrors.push({ field: 'surname', message: 'Enter the main occupier’s last name' })
      }

      if (!relation) {
        validationErrors.push({
          field: 'relation',
          message: `Enter the main occupier’s relationship to ${prisonerName}`,
        })
      }

      if (otherResident) {
        otherResident.forEach((resident: OtherResident, index: number) => {
          if (this.areAllFieldsEmpty(resident)) {
            otherResident.splice(index, 1)
          }
          if (!!resident.forename || !!resident.surname || !!resident.relation || !!resident.age) {
            const residentIndexMessage =
              otherResident.length > 1 ? ` the ${getOrdinal(index + 1)} other resident’s` : ' the other resident’s'
            if (!resident.forename) {
              validationErrors.push({
                field: `otherResident[${index}][forename]`,
                message: `Enter${residentIndexMessage} first name`,
              })
            }

            if (!resident.surname) {
              validationErrors.push({
                field: `otherResident[${index}][surname]`,
                message: `Enter${residentIndexMessage} last name`,
              })
            }

            if (!resident.relation) {
              validationErrors.push({
                field: `otherResident[${index}][relation]`,
                message: `Enter${residentIndexMessage} relationship to ${prisonerName}`,
              })
            }

            if (!resident.age) {
              validationErrors.push({
                field: `otherResident[${index}][age]`,
                message: `Enter${residentIndexMessage} age`,
              })
            }
          }
        })
      }

      return validationErrors
    })

    const mainResident = {
      residentId,
      forename,
      surname,
      phoneNumber,
      relation,
      isMainResident: true,
    } as _ResidentSummary

    const otherResidents = otherResident
      ? otherResident.map(this.transformToResidentSummary).filter((resident: _ResidentSummary | null) => resident)
      : []

    await this.addressService.addResidents(req?.middleware?.clientToken, prisonNumber, Number(checkRequestId), [
      mainResident,
      ...otherResidents,
    ])

    return res.redirect(
      paths.prison.assessment.enterCurfewAddressOrCasArea.moreInformationRequiredCheck({
        prisonNumber: req.params.prisonNumber,
        checkRequestId,
      }),
    )
  }

  transformToResidentSummary(otherResident: OtherResident): _ResidentSummary {
    const { residentId, forename, surname, relation, day, month, year, age } = otherResident
    const dateOfBirth = day && month && year ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` : null

    return {
      residentId,
      forename,
      surname,
      relation,
      dateOfBirth,
      age: age || null,
      isMainResident: false,
    }
  }

  areAllFieldsEmpty(resident: OtherResident): boolean {
    return !resident.forename && !resident.surname && !resident.relation && !resident.age
  }
}
