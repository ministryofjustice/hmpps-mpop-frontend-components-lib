import { isAtLarge } from './isAtLarge'
import { Sentence } from '../types/SupervisionPackage'

describe('isAtLarge', () => {
  it('returns true when a non-SPX sentence has custody location code UATLRG', () => {
    expect(
      isAtLarge([{ supervisionPackage: { code: 'SPA' }, custody: { location: { code: 'UATLRG' } } }] as Sentence[]),
    ).toBe(true)
  })

  it('returns false when the only sentence with custody location code UATLRG has code SPX', () => {
    expect(
      isAtLarge([{ supervisionPackage: { code: 'SPX' }, custody: { location: { code: 'UATLRG' } } }] as Sentence[]),
    ).toBe(false)
  })

  it('returns false when none of the conditions match', () => {
    expect(
      isAtLarge([{ supervisionPackage: { code: 'SPA' }, custody: { location: { code: 'ABC' } } }] as Sentence[]),
    ).toBe(false)
  })

  it('returns false when sentences and recallStatus are undefined', () => {
    expect(isAtLarge(undefined)).toBe(false)
  })

  it('returns false when sentences and recallStatus are null', () => {
    expect(isAtLarge(null)).toBe(false)
  })
})
