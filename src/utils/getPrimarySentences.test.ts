import { getPrimarySentences } from './getPrimarySentences'
import { Sentence } from '../types/SupervisionPackage'

describe('getPrimarySentences', () => {
  it('returns sentences whose supervisionPackage code is not SPX', () => {
    expect(
      getPrimarySentences([
        { supervisionPackage: { code: 'SPX' } },
        { supervisionPackage: { code: 'SPA' } },
        { supervisionPackage: { code: 'SPB' } },
      ] as Sentence[]),
    ).toEqual([{ supervisionPackage: { code: 'SPA' } }, { supervisionPackage: { code: 'SPB' } }])
  })

  it('returns an empty array when all sentences have code SPX', () => {
    expect(getPrimarySentences([{ supervisionPackage: { code: 'SPX' } }] as Sentence[])).toEqual([])
  })

  it('returns an empty array when sentences is undefined', () => {
    expect(getPrimarySentences(undefined)).toEqual([])
  })

  it('returns an empty array when sentences is null', () => {
    expect(getPrimarySentences(null)).toEqual([])
  })

  it('returns an empty array when sentences is empty', () => {
    expect(getPrimarySentences([])).toEqual([])
  })
})
