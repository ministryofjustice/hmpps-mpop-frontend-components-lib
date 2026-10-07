import { hasRestrictedCustodyStatus } from './hasRestrictedCustodyStatus'
import { FrontendSentence } from '../types/SupervisionPackage'

describe('hasRestrictedCustodyStatus', () => {
  it.each(['D', 'I', 'R', 'C'])('returns true when the custody status code is %s', code => {
    expect(hasRestrictedCustodyStatus({ custody: { status: { code } } } as FrontendSentence)).toBe(true)
  })

  it('is case-insensitive', () => {
    expect(hasRestrictedCustodyStatus({ custody: { status: { code: 'r' } } } as FrontendSentence)).toBe(true)
  })

  it('returns false for a non-restricted custody status code', () => {
    expect(hasRestrictedCustodyStatus({ custody: { status: { code: 'B' } } } as FrontendSentence)).toBe(false)
  })

  it('returns false when sentence is undefined', () => {
    expect(hasRestrictedCustodyStatus(undefined)).toBe(false)
  })

  it('returns false when custody status code is missing', () => {
    expect(hasRestrictedCustodyStatus({ custody: {} } as FrontendSentence)).toBe(false)
  })
})
