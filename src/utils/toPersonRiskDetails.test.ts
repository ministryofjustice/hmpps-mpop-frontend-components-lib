import { toPersonRiskDetails } from './toPersonRiskDetails'
import type { PersonRiskFlags, RiskFlag } from '../types/RiskFlag'

const riskFlag = (overrides: Partial<RiskFlag>): RiskFlag => ({
  id: 1,
  description: 'Risk to Staff',
  createdDate: '2024-01-01',
  createdBy: { forename: 'Jane', surname: 'Smith' },
  removed: false,
  removalHistory: [],
  ...overrides,
})

const personRiskFlags = (overrides: Partial<PersonRiskFlags> = {}): PersonRiskFlags => ({
  personSummary: { name: { forename: 'James', surname: 'Morrison' }, crn: 'X000001', dateOfBirth: '1990-01-01' },
  opd: {},
  mappa: {},
  riskFlags: [],
  removedRiskFlags: [],
  ...overrides,
})

describe('toPersonRiskDetails', () => {
  it('returns empty details when there are no risk flags', () => {
    expect(toPersonRiskDetails(null)).toEqual({ personRisks: null, rosh: { level: null, assessedOn: null } })
    expect(toPersonRiskDetails(undefined)).toEqual({ personRisks: null, rosh: { level: null, assessedOn: null } })
  })

  it('replaces RoSH with ROSH in active and removed risk flag descriptions', () => {
    const { personRisks } = toPersonRiskDetails(
      personRiskFlags({
        riskFlags: [riskFlag({ id: 2, description: 'High RoSH' })],
        removedRiskFlags: [riskFlag({ id: 3, description: 'Medium RoSH', removed: true })],
      }),
    )

    expect(personRisks?.riskFlags[0].description).toBe('High ROSH')
    expect(personRisks?.removedRiskFlags[0].description).toBe('Medium ROSH')
  })

  it('does not change the risk flags passed in', () => {
    const input = personRiskFlags({
      riskFlags: [
        riskFlag({ id: 2, description: 'High RoSH' }),
        riskFlag({ id: 3, description: 'Risk to Probation Staff', level: 'HIGH' }),
      ],
    })
    const copy = structuredClone(input)

    toPersonRiskDetails(input)

    expect(input).toEqual(copy)
  })

  it('clears the level on Risk to Probation Staff', () => {
    const { personRisks, riskToProbationStaff } = toPersonRiskDetails(
      personRiskFlags({ riskFlags: [riskFlag({ id: 4, description: 'Risk to Probation Staff', level: 'HIGH' })] }),
    )

    expect(personRisks?.riskFlags[0].level).toBeUndefined()
    expect(riskToProbationStaff).toEqual({ id: 4 })
  })

  it('builds the risk badges from the risk flags as returned by the API', () => {
    const { riskBadgeData } = toPersonRiskDetails(
      personRiskFlags({
        riskFlags: [
          riskFlag({ id: 4, description: 'Risk to Probation Staff', levelDescription: 'High', level: 'HIGH' }),
        ],
      }),
    )

    expect(riskBadgeData?.headerBadges).toEqual([expect.objectContaining({ id: 4 })])
  })

  it('does not build risk badges when risk flags are not present', () => {
    const { riskBadgeData, personRisks } = toPersonRiskDetails(
      personRiskFlags({ riskFlags: undefined as unknown as RiskFlag[] }),
    )

    expect(riskBadgeData).toBeUndefined()
    expect(personRisks?.riskFlags).toBeUndefined()
  })

  it.each([
    ['Medium', 'MEDIUM'],
    ['High', 'HIGH'],
    ['VERY HIGH', 'VERY_HIGH'],
  ])('sets riskToStaff with level %s as %s', (levelDescription, level) => {
    const { riskToStaff } = toPersonRiskDetails(
      personRiskFlags({ riskFlags: [riskFlag({ id: 1, description: 'Risk to Staff', levelDescription })] }),
    )

    expect(riskToStaff).toEqual({ id: 1, level })
  })

  it('sets the riskToStaff level to null when there is no level', () => {
    const { riskToStaff } = toPersonRiskDetails(
      personRiskFlags({ riskFlags: [riskFlag({ id: 1, description: 'Risk to Staff' })] }),
    )

    expect(riskToStaff).toEqual({ id: 1, level: null })
  })

  it('does not set riskToStaff or riskToProbationStaff when there are no matching flags', () => {
    const { riskToStaff, riskToProbationStaff } = toPersonRiskDetails(
      personRiskFlags({ riskFlags: [riskFlag({ description: 'Child Concerns' })] }),
    )

    expect(riskToStaff).toBeUndefined()
    expect(riskToProbationStaff).toBeUndefined()
  })

  it('sets rosh from the ROSH risk flag', () => {
    const { rosh } = toPersonRiskDetails(
      personRiskFlags({
        riskFlags: [riskFlag({ id: 2, description: 'Very High RoSH', mostRecentReviewDate: '2026-10-01' })],
      }),
    )

    expect(rosh).toEqual({ level: 'VERY HIGH', assessedOn: '2026-10-01' })
  })

  it('sets the rosh level to null when there is no ROSH risk flag', () => {
    expect(toPersonRiskDetails(personRiskFlags()).rosh).toEqual({ level: null, assessedOn: null })
  })
})
