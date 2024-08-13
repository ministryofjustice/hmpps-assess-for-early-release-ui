import { dataAccess, hmppsComponentsClientBuilder } from '../data'
import AuditService from './auditService'
import HmppsComponentsService from './hmppsComponentsService'

const { hmppsAuditClient } = dataAccess()
const auditService = new AuditService(hmppsAuditClient)
const hmppsComponentsService = new HmppsComponentsService(hmppsComponentsClientBuilder)

export const services = {
  auditService,
  hmppsComponentsService,
}

export type Services = typeof services
export { HmppsComponentsService }
