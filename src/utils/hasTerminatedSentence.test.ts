import { hasTerminatedSentence } from './hasTerminatedSentence'
import { FrontendSentence } from '../types/SupervisionPackage'

describe('hasTerminatedSentence', () => {
  it('returns true when a sentence custody status code is T', () => {
    expect(
      hasTerminatedSentence([
        { supervisionPackage: { code: 'SPA' }, type: { isCustodial: true }, custody: { status: { code: 'T' } } },
      ] as FrontendSentence[]),
    ).toBe(true)
  })

  it('returns false when sentence is custodial but is not terminated', () => {
    expect(
      hasTerminatedSentence([
        { supervisionPackage: { code: 'SPA' }, custody: { status: { code: 'B' } } },
      ] as FrontendSentence[]),
    ).toBe(false)
  })

  it('returns true when at least one of multiple sentences is custodial and recalled', () => {
    expect(
      hasTerminatedSentence([
        { supervisionPackage: { code: 'SPA' }, custody: { status: { code: 'C' } } },
        { supervisionPackage: { code: 'SPA' }, custody: { status: { code: 'T' } } },
        { supervisionPackage: { code: 'SPA' }, custody: { status: { code: 'A' } } },
      ] as FrontendSentence[]),
    ).toBe(true)
  })

  it('returns false when sentences is undefined', () => {
    expect(hasTerminatedSentence(undefined)).toBe(false)
  })

  it('returns false when sentences is an empty array', () => {
    expect(hasTerminatedSentence([])).toBe(false)
  })
})
