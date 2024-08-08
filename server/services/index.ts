import { dataAccess } from '../data'
import AuditService from './auditService'

const { applicationInfo, hmppsAuditClient } = dataAccess()
const auditService = new AuditService(hmppsAuditClient)

export const services = {
  applicationInfo,
  auditService,
}

export type Services = typeof services
