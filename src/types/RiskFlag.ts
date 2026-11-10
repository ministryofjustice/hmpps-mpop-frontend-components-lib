export interface Name {
  forename: string
  middleName?: string
  surname: string
  username?: string
}

export interface Note {
  id: number
  createdBy?: string
  createdByDate?: string
  note: string
  hasNoteBeenTruncated?: boolean
}

export interface RemovalHistory {
  notes?: string
  removalDate: string
  removedBy: Name
}

export interface RiskFlag {
  id: number
  description: string
  levelDescription?: string
  level?: RiskFlagLevel
  riskNotes?: Note[]
  riskNote?: Note
  nextReviewDate?: string
  mostRecentReviewDate?: string | null
  createdDate: string
  createdBy: Name
  removed: boolean
  removalHistory: RemovalHistory[]
}

export type RiskFlagLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATION_ONLY'

export type RoshBadgeLevel = RiskFlagLevel | 'VERY HIGH'

export interface PersonSummary {
  name: Name
  crn: string
  offenderId?: number
  pnc?: string
  dateOfBirth: string
  preferredLanguage?: string
}

export interface Mappa {
  level?: number
  category?: number
  categoryDescription?: string
  startDate?: string
  reviewDate?: string
}

export interface Opd {
  eligible?: boolean
  date?: string
}

export interface PersonRiskFlags {
  personSummary: PersonSummary
  opd: Opd
  mappa: Mappa
  riskFlags: RiskFlag[]
  removedRiskFlags: RiskFlag[]
}

export type PersonRiskFlagsResponse = {
  personRiskFlags: PersonRiskFlags | null
  httpStatus: number
  error?: Error | null
}
