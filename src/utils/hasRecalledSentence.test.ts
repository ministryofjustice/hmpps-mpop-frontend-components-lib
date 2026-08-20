import { hasRecalledSentence } from './hasRecalledSentence'
import { FrontendSentence } from '../types/SupervisionPackage'

describe('hasRecalledSentence', () => {
  it('returns true when a sentence is custodial and its code is C', () => {
    expect(
      hasRecalledSentence([
        { supervisionPackage: { code: 'SPA' }, custody: { status: { code: 'C' } } },
      ] as FrontendSentence[]),
    ).toBe(true)
  })

  it('returns false when a sentence is custodial but is not recalled', () => {
    expect(
      hasRecalledSentence([
        { supervisionPackage: { code: 'SPA' }, custody: { status: { code: 'B' } } },
      ] as FrontendSentence[]),
    ).toBe(false)
  })

  it('returns true when at least one of multiple sentences is custodial and recalled', () => {
    expect(
      hasRecalledSentence([
        { supervisionPackage: { code: 'SPA' }, custody: { status: { code: 'C' } } },
        { supervisionPackage: { code: 'SPA' }, custody: { status: { code: 'B' } } },
        { supervisionPackage: { code: 'SPA' }, custody: { status: { code: 'A' } } },
      ] as FrontendSentence[]),
    ).toBe(true)
  })

  it('returns false when sentences is undefined', () => {
    expect(hasRecalledSentence(undefined)).toBe(false)
  })

  it('returns false when sentences is an empty array', () => {
    expect(hasRecalledSentence([])).toBe(false)
  })
})
