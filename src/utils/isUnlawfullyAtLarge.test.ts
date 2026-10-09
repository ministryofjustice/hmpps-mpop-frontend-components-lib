import { isUnlawfullyAtLarge } from './isUnlawfullyAtLarge'
import { FrontendSentence } from '../types/SupervisionPackage'

describe('isUnlawfullyAtLarge', () => {
  it('returns true when the custody location code is UATLRG', () => {
    expect(isUnlawfullyAtLarge({ custody: { location: { code: 'UATLRG' } } } as FrontendSentence)).toBe(true)
  })

  it('returns false for a different custody location code', () => {
    expect(isUnlawfullyAtLarge({ custody: { location: { code: 'OUT' } } } as FrontendSentence)).toBe(false)
  })

  it('returns false when sentence is undefined', () => {
    expect(isUnlawfullyAtLarge(undefined)).toBe(false)
  })
})
