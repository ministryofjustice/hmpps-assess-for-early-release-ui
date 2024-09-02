import { dataAccess, hmppsComponentsClientBuilder } from '../data'
import AssessCaseloadService from './assessCaseloadService'
import AuditService from './auditService'
import HmppsComponentsService from './hmppsComponentsService'

const { hmppsAuditClient, assessApiClient } = dataAccess()
const auditService = new AuditService(hmppsAuditClient)
const hmppsComponentsService = new HmppsComponentsService(hmppsComponentsClientBuilder)
const assessCaseloadService = new AssessCaseloadService(assessApiClient)

export const services = {
  auditService,
  hmppsComponentsService,
  assessCaseloadService,
}

export type Services = typeof services
export { HmppsComponentsService }
