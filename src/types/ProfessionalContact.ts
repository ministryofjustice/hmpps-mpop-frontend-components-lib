import { Name } from './RiskFlag'
import type { ApiResponse } from './ApiResponse'

export interface ProfessionalContact {
  name: Name
  currentContacts: Contact[]
  previousContacts: Contact[]
}

export interface Contact {
  name: string
  telephoneNumber: string
  email: string
  provider: string
  probationDeliveryUnit: string
  team: string
  allocationDate: string
  allocatedUntil?: string
  responsibleOfficer: boolean
  prisonOffenderManager: boolean
  isUnallocated?: boolean
  lastUpdated?: string
}

export type ProfessionalContactResponse = ApiResponse & {
  professionalContact: ProfessionalContact | null
}
