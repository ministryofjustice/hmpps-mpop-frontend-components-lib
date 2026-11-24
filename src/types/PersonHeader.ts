import type { Name, RiskFlag } from './RiskFlag'
import type { ProfessionalContact } from './ProfessionalContact'
import type { RiskBadgeData } from '../utils/personRiskFlagSorter'

export interface PersonHeaderParamsInput {
  crn: string
  name: Pick<Name, 'forename' | 'surname'>
  dateOfBirth?: string
  tier?: { tierScore?: string; provisional?: boolean } | null
  historyHref?: string
  tierUrl?: string
  professionalContact?: ProfessionalContact | null
  managedByHref?: string
  riskFlags?: RiskFlag[] | null
  riskBadgeData?: RiskBadgeData
  personStatusTag?: string
  photo?: string
  riskBadges?: string
  riskData?: object | null
  roshLevel?: string | null
  useNDeliusRosh?: boolean
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
  riskData?: object | null
  roshLevel?: string | null
  useNDeliusRosh?: boolean
  personRiskFlags?: RiskBadgeData
  collapsibleRiskFlags?: boolean
  riskHrefBase?: string
  showRisks?: boolean
  personStatusTag?: string
}
