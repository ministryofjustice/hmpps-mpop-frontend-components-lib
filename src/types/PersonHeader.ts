import type { Name, RiskFlag } from './RiskFlag'
import type { ProfessionalContact } from './ProfessionalContact'
import type { RiskBadgeData } from '../utils/personRiskFlagSorter'

export interface PersonHeaderParamsInput {
  crn: string
  name: Pick<Name, 'forename' | 'surname'>
  dateOfBirth?: string
  tier?: { tierScore?: string; provisional?: boolean } | null
  historyHref?: string
  professionalContact?: ProfessionalContact | null
  riskFlags?: RiskFlag[] | null
  personStatusTag?: string
  photo?: string
  riskBadges?: string
  collapsibleRiskFlags?: boolean
  riskHrefBase?: string
  showRisks?: boolean
}

export interface PersonHeaderParams {
  name: string
  crn: string
  dob?: string
  tier: string
  provisional: boolean
  historyHref?: string
  managedBy: string
  managedByName?: string
  managedByLocation?: string
  managedByHref?: string
  photo?: string
  riskBadges?: string
  personRiskFlags?: RiskBadgeData
  collapsibleRiskFlags?: boolean
  riskHrefBase?: string
  showRisks?: boolean
  personStatusTag?: string
}
