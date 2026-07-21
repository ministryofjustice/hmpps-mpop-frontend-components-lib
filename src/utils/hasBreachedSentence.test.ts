import { hasBreachedSentence } from './hasBreachedSentence'

describe('hasBreachedSentence', () => {
  it('returns true when a sentence is in breach and its code is not SPX', () => {
    expect(hasBreachedSentence([{ supervisionPackage: { code: 'SPA' }, inBreach: true }])).toBe(true)
  })

  it('returns false when the only breached sentence has code SPX', () => {
    expect(hasBreachedSentence([{ supervisionPackage: { code: 'SPX' }, inBreach: true }])).toBe(false)
  })

  it('returns false when no sentences are in breach', () => {
    expect(hasBreachedSentence([{ supervisionPackage: { code: 'SPA' }, inBreach: false }])).toBe(false)
  })

  it('returns true when at least one of multiple sentences qualifies', () => {
    expect(
      hasBreachedSentence([
        { supervisionPackage: { code: 'SPX' }, inBreach: true },
        { supervisionPackage: { code: 'SPA' }, inBreach: false },
        { supervisionPackage: { code: 'SPB' }, inBreach: true },
      ]),
    ).toBe(true)
  })

  it('returns false when sentences is undefined', () => {
    expect(hasBreachedSentence(undefined)).toBe(false)
  })

  it('returns false when sentences is an empty array', () => {
    expect(hasBreachedSentence([])).toBe(false)
  })
})
