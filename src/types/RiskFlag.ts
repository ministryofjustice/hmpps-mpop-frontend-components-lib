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
