import { dataAccess, hmppsComponentsClientBuilder } from '../data'
import AuditService from './auditService'
import DecisionMakerCaseloadService from './decisionMakerCaseloadService'
import HmppsComponentsService from './hmppsComponentsService'

const { hmppsAuditClient, decisionMakerApiClient } = dataAccess()
const auditService = new AuditService(hmppsAuditClient)
const hmppsComponentsService = new HmppsComponentsService(hmppsComponentsClientBuilder)
const decisionMakerCaseloadService = new DecisionMakerCaseloadService(decisionMakerApiClient)

export const services = {
  auditService,
  hmppsComponentsService,
  decisionMakerCaseloadService,
}

export type Services = typeof services
export { HmppsComponentsService }
