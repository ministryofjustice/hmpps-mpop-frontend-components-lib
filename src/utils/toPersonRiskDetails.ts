import type { PersonRiskFlags, RiskFlag, RiskScore, RoshBadgeLevel } from '../types/RiskFlag'
import { getRiskBadges, RiskBadgeData } from './personRiskFlagSorter'
import { getProbationRisk, getStaffRisk } from './getStaffRisk'
import { getRiskRoshScore } from './getRiskRoshScore'

export interface PersonRiskDetails {
  personRisks: PersonRiskFlags | null
  riskBadgeData?: RiskBadgeData
  riskToStaff?: { id: number; level: RiskScore | null }
  riskToProbationStaff?: { id: number }
  rosh: { level: RoshBadgeLevel | null | undefined; assessedOn: string | null | undefined }
}

const term = 'RoSH'

const replaceRosh = (riskFlags?: RiskFlag[]): RiskFlag[] | undefined =>
  riskFlags?.map(flag => ({ ...flag, description: flag.description.split(term).join(term.toUpperCase()) }))

const getRiskToStaffLevel = (riskToStaff: RiskFlag): RiskScore | null => {
  let level: string | undefined = riskToStaff.levelDescription ?? riskToStaff.level
  if (level?.toUpperCase() === 'VERY HIGH') {
    level = 'VERY_HIGH'
  }
  return level && ['VERY_HIGH', 'HIGH', 'MEDIUM'].includes(level.toUpperCase())
    ? (level.toUpperCase() as RiskScore)
    : null
}

export const toPersonRiskDetails = (personRiskFlags: PersonRiskFlags | null | undefined): PersonRiskDetails => {
  if (!personRiskFlags) {
    return { personRisks: null, rosh: { level: null, assessedOn: null } }
  }

  const riskBadgeData = personRiskFlags.riskFlags ? getRiskBadges(personRiskFlags.riskFlags) : undefined

  const renamedRiskFlags = replaceRosh(personRiskFlags.riskFlags)
  const riskToStaff = getStaffRisk(renamedRiskFlags)
  const riskToProbationStaff = getProbationRisk(renamedRiskFlags)

  const riskFlags = renamedRiskFlags?.map(item =>
    item.description === 'Risk to Probation Staff' ? { ...item, level: undefined } : item,
  )

  const { score, assessedOn } = getRiskRoshScore(riskFlags ?? [])

  return {
    personRisks: {
      ...personRiskFlags,
      riskFlags: riskFlags as RiskFlag[],
      removedRiskFlags: replaceRosh(personRiskFlags.removedRiskFlags) as RiskFlag[],
    },
    riskBadgeData,
    riskToStaff: riskToStaff ? { id: riskToStaff.id, level: getRiskToStaffLevel(riskToStaff) } : undefined,
    riskToProbationStaff: riskToProbationStaff ? { id: riskToProbationStaff.id } : undefined,
    rosh: { level: score, assessedOn },
  }
}
