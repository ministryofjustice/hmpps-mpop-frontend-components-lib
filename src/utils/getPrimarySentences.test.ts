import { getPrimarySentences } from './getPrimarySentences'

describe('getPrimarySentences', () => {
  it('returns sentences whose supervisionPackage code is not SPX', () => {
    expect(
      getPrimarySentences([
        { supervisionPackage: { code: 'SPX' } },
        { supervisionPackage: { code: 'SPA' } },
        { supervisionPackage: { code: 'SPB' } },
      ]),
    ).toEqual([{ supervisionPackage: { code: 'SPA' } }, { supervisionPackage: { code: 'SPB' } }])
  })

  it('returns an empty array when all sentences have code SPX', () => {
    expect(getPrimarySentences([{ supervisionPackage: { code: 'SPX' } }])).toEqual([])
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
