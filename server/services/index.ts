import { dataAccess, hmppsComponentsClientBuilder } from '../data'
import AuditService from './auditService'
import CaseAdminCaseloadService from './caseAdminCaseloadService'
import HmppsComponentsService from './hmppsComponentsService'

export const services = () => {
  const { hmppsAuditClient, assessForEarlyReleaseApiClientBuilder, hmppsAuthClient } = dataAccess
  const auditService = new AuditService(hmppsAuditClient)
  const hmppsComponentsService = new HmppsComponentsService(hmppsComponentsClientBuilder)
  const caseAdminCaseloadService = new CaseAdminCaseloadService(assessForEarlyReleaseApiClientBuilder)
  return {
    auditService,
    hmppsComponentsService,
    caseAdminCaseloadService,
    hmppsAuthClient,
  }
}

export type Services = ReturnType<typeof services>

export { HmppsComponentsService, CaseAdminCaseloadService }
