import { isAtLarge } from './isAtLarge'

describe('isAtLarge', () => {
  it('returns true when a non-SPX sentence has custody location code UATLRG', () => {
    expect(isAtLarge([{ supervisionPackage: { code: 'SPA' }, custody: { location: { code: 'UATLRG' } } }])).toBe(true)
  })

  it('returns false when the only sentence with custody location code UATLRG has code SPX', () => {
    expect(isAtLarge([{ supervisionPackage: { code: 'SPX' }, custody: { location: { code: 'UATLRG' } } }])).toBe(false)
  })

  it('returns false when none of the conditions match', () => {
    expect(
      isAtLarge([{ supervisionPackage: { code: 'SPA' }, custody: { location: { code: 'ABC' } } }], { code: 'REC02' }),
    ).toBe(false)
  })

  it('returns false when sentences and recallStatus are undefined', () => {
    expect(isAtLarge(undefined, undefined)).toBe(false)
  })

  it('returns false when sentences and recallStatus are null', () => {
    expect(isAtLarge(null, null)).toBe(false)
  })
})
