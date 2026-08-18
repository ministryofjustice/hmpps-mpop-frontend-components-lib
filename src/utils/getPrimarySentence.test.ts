import { getPrimarySentence } from './getPrimarySentence'
import { FrontendSentence } from '../types/SupervisionPackage'

describe('getPrimarySentence', () => {
  it('returns the first sentence whose supervisionPackage code is not SPX', () => {
    expect(
      getPrimarySentence([
        { supervisionPackage: { code: 'SPX' } },
        { supervisionPackage: { code: 'SPA' } },
        { supervisionPackage: { code: 'SPB' } },
      ] as FrontendSentence[]),
    ).toEqual({ supervisionPackage: { code: 'SPA' } })
  })

  it('returns null when all sentences have code SPX', () => {
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
})
