import { getPrimarySentence, isSpxOnlySentenceList } from './getPrimarySentence'
import { FrontendSentence } from '../types/SupervisionPackage'

describe('getPrimarySentence', () => {
  it('returns the first sentence whose supervisionPackage code is not SPX', () => {
    expect(
      getPrimarySentence([
        {},
        { supervisionPackage: { code: 'SPX' } },
        { supervisionPackage: { code: 'SPA' } },
        { supervisionPackage: { code: 'SPB' } },
      ] as FrontendSentence[]),
    ).toEqual({ supervisionPackage: { code: 'SPA' } })
  })

  // Regression test: a single SPX sentence must not be returned as the primary sentence
  it('returns null when there is only one sentence and it is SPX', () => {
    expect(getPrimarySentence([{ supervisionPackage: { code: 'SPX' } }] as FrontendSentence[])).toBeNull()
  })

  // Regression test: must return null, not undefined, when no sentence matches
  it('returns null (not undefined) when multiple sentences exist but none is a valid primary', () => {
    const result = getPrimarySentence([
      { supervisionPackage: { code: 'SPX' } },
      { supervisionPackage: { code: 'SPX' } },
    ] as FrontendSentence[])

    expect(result).toBe(null)
    expect(result).not.toBeUndefined()
  })

  it('returns null when sentences is undefined', () => {
    expect(getPrimarySentence(undefined)).toBeNull()
  })

  it('returns null when sentences is null', () => {
    expect(getPrimarySentence(null)).toBeNull()
  })

  it('returns null when sentences is empty', () => {
    expect(getPrimarySentence([])).toBeNull()
  })

  it('returns the single sentence when there is only one and it has no supervision package', () => {
    const sentence = {} as FrontendSentence

    expect(getPrimarySentence([sentence])).toBe(sentence)
  })

  it('returns the single sentence when there is only one and it is not SPX', () => {
    expect(getPrimarySentence([{ supervisionPackage: { code: 'SPA' } }] as FrontendSentence[])).toEqual({
      supervisionPackage: { code: 'SPA' },
    })
  })
})

describe('isSpxOnlySentenceList', () => {
  it('returns false when sentences is undefined', () => {
    expect(isSpxOnlySentenceList(undefined)).toBe(false)
  })

  it('returns false when sentences is null', () => {
    expect(isSpxOnlySentenceList(null)).toBe(false)
  })

  it('returns false when sentences is empty', () => {
    expect(isSpxOnlySentenceList([])).toBe(false)
  })

  it('returns true when every sentence is SPX', () => {
    expect(
      isSpxOnlySentenceList([
        { supervisionPackage: { code: 'SPX' } },
        { supervisionPackage: { code: 'SPX' } },
      ] as FrontendSentence[]),
    ).toBe(true)
  })

  it('returns false when at least one sentence is not SPX', () => {
    expect(
      isSpxOnlySentenceList([
        { supervisionPackage: { code: 'SPX' } },
        { supervisionPackage: { code: 'SPA' } },
      ] as FrontendSentence[]),
    ).toBe(false)
  })

  it('returns false when a sentence has no supervisionPackage', () => {
    expect(isSpxOnlySentenceList([{} as FrontendSentence])).toBe(false)
  })
})
