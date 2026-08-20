import { hasBreachedSentence } from './hasBreachedSentence'
import { FrontendSentence } from '../types/SupervisionPackage'

describe('hasBreachedSentence', () => {
  it('returns true when a sentence is in breach and its code is not SPX', () => {
    expect(hasBreachedSentence([{ supervisionPackage: { code: 'SPA' }, inBreach: true }] as FrontendSentence[])).toBe(
      true,
    )
  })

  it('returns true when a sentence is in breach', () => {
    expect(hasBreachedSentence([{ supervisionPackage: { code: 'SPX' }, inBreach: true }] as FrontendSentence[])).toBe(
      true,
    )
  })

  it('returns false when no sentences are in breach', () => {
    expect(hasBreachedSentence([{ supervisionPackage: { code: 'SPA' }, inBreach: false }] as FrontendSentence[])).toBe(
      false,
    )
  })

  it('returns true when the primary sentence is in breach among SPX sentences', () => {
    expect(
      hasBreachedSentence([
        { supervisionPackage: { code: 'SPX' }, inBreach: true },
        { supervisionPackage: { code: 'SPA' }, inBreach: true },
      ] as FrontendSentence[]),
    ).toBe(true)
  })

  it('returns false when sentences is undefined', () => {
    expect(hasBreachedSentence(undefined)).toBe(false)
  })

  it('returns false when sentences is an empty array', () => {
    expect(hasBreachedSentence([])).toBe(false)
  })
})
