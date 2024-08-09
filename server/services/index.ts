import { dataAccess } from '../data'
import AuditService from './auditService'

const { hmppsAuditClient } = dataAccess()
const auditService = new AuditService(hmppsAuditClient)

export const services = {
  auditService,
}

export type Services = typeof services
