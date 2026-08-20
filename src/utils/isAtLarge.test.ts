import { isAtLarge } from './isAtLarge'
import { FrontendSentence } from '../types/SupervisionPackage'

describe('isAtLarge', () => {
  it('returns true when a non-SPX sentence has custody location code UATLRG', () => {
    expect(
      isAtLarge([
        { supervisionPackage: { code: 'SPA' }, custody: { location: { code: 'UATLRG' } } },
      ] as FrontendSentence[]),
    ).toBe(true)
  })

  it('returns true when any sentence has custody location code UATLRG', () => {
    expect(
      isAtLarge([
        { supervisionPackage: { code: 'SPX' }, custody: { location: { code: 'UATLRG' } } },
      ] as FrontendSentence[]),
    ).toBe(true)
  })

  it('returns false when none of the conditions match', () => {
    expect(
      isAtLarge([
        { supervisionPackage: { code: 'SPA' }, custody: { location: { code: 'ABC' } } },
      ] as FrontendSentence[]),
    ).toBe(false)
  })

  it('returns false when sentences and recallStatus are undefined', () => {
    expect(isAtLarge(undefined)).toBe(false)
  })

  it('returns false when sentences and recallStatus are null', () => {
    expect(isAtLarge(null)).toBe(false)
  })
})
