import type { RiskScore } from './RiskFlag'

export interface RiskSummary {
  summary?: {
    whoIsAtRisk?: string | null
    natureOfRisk?: string | null
    riskImminence?: string | null
    riskIncreaseFactors?: string | null
    riskMitigationFactors?: string | null
    riskInCommunity?: Partial<Record<RiskScore, string[]>>
    riskInCustody?: Partial<Record<RiskScore, string[]>>
    overallRiskLevel: RiskScore
  }
  assessedOn?: string | null
}

export interface RoshRiskWidgetDto {
  overallRisk?: string
  assessedOn?: string | null
  risks?: { riskTo: string; community: string | string[]; custody: string | string[] }[]
}
