import { hasBreachedSentence } from './hasBreachedSentence'
import { Sentence } from '../types/SupervisionPackage'

describe('hasBreachedSentence', () => {
  it('returns true when a sentence is in breach and its code is not SPX', () => {
    expect(hasBreachedSentence([{ supervisionPackage: { code: 'SPA' }, inBreach: true }] as Sentence[])).toBe(true)
  })

  it('returns false when the only breached sentence has code SPX', () => {
    expect(hasBreachedSentence([{ supervisionPackage: { code: 'SPX' }, inBreach: true }] as Sentence[])).toBe(false)
  })

  it('returns false when no sentences are in breach', () => {
    expect(hasBreachedSentence([{ supervisionPackage: { code: 'SPA' }, inBreach: false }] as Sentence[])).toBe(false)
  })

  it('returns true when at least one of multiple sentences qualifies', () => {
    expect(
      hasBreachedSentence([
        { supervisionPackage: { code: 'SPX' }, inBreach: true },
        { supervisionPackage: { code: 'SPA' }, inBreach: false },
        { supervisionPackage: { code: 'SPB' }, inBreach: true },
      ] as Sentence[]),
    ).toBe(true)
  })

  it('returns false when sentences is undefined', () => {
    expect(hasBreachedSentence(undefined)).toBe(false)
  })

  it('returns false when sentences is an empty array', () => {
    expect(hasBreachedSentence([])).toBe(false)
  })
})
