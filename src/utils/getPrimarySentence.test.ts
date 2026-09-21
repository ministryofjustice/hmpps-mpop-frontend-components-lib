import { getPrimarySentence } from './getPrimarySentence'
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
})
