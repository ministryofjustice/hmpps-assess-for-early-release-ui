import { dataAccess, hmppsComponentsClientBuilder } from '../data'
import AuditService from './auditService'
import CaseAdminCaseloadService from './caseAdminCaseloadService'
import HmppsComponentsService from './hmppsComponentsService'

const { hmppsAuditClient, assessForEarlyReleaseApiClientBuilder } = dataAccess
const auditService = new AuditService(hmppsAuditClient)
const hmppsComponentsService = new HmppsComponentsService(hmppsComponentsClientBuilder)
const caseAdminCaseloadService = new CaseAdminCaseloadService(assessForEarlyReleaseApiClientBuilder)

export const services = {
  auditService,
  hmppsComponentsService,
  caseAdminCaseloadService,
}

export type Services = typeof services
export { HmppsComponentsService }
