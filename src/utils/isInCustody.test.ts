import { isInCustody } from './isInCustody'

describe('isInCustody', () => {
  it.each(['D', 'I', 'R'])('returns the description when a non-SPX sentence has custody status code %s', code => {
    expect(
      isInCustody([{ supervisionPackage: { code: 'SPA' }, custody: { status: { code, description: 'In Custody' } } }]),
    ).toBe('In Custody')
  })

  it('returns undefined when the only matching sentence has code SPX', () => {
    expect(
      isInCustody([
        { supervisionPackage: { code: 'SPX' }, custody: { status: { code: 'D', description: 'In Custody' } } },
      ]),
    ).toBeUndefined()
  })

  it('returns undefined when no sentence has a custody status code', () => {
    expect(isInCustody([{ supervisionPackage: { code: 'SPA' }, custody: { status: {} } }])).toBeUndefined()
  })

  it('returns the description of the first matching sentence when multiple non-SPX sentences qualify', () => {
    expect(
      isInCustody([
        { supervisionPackage: { code: 'SPX' }, custody: { status: { code: 'D', description: 'Ignored' } } },
        { supervisionPackage: { code: 'SPA' }, custody: { status: { code: 'C', description: 'Community custody' } } },
        { supervisionPackage: { code: 'SPB' }, custody: { status: { code: 'I', description: 'In Custody - IRC' } } },
      ]),
    ).toBe('Community custody')
  })

  it('returns undefined when sentences is undefined', () => {
    expect(isInCustody(undefined)).toBeUndefined()
  })

  it('returns undefined when sentences is an empty array', () => {
    expect(isInCustody([])).toBeUndefined()
  })

  it('returns undefined when the only matching sentence has a code in codeExceptions', () => {
    expect(
      isInCustody(
        [{ supervisionPackage: { code: 'SPA' }, custody: { status: { code: 'B', description: 'Bailed' } } }],
        ['B'],
      ),
    ).toBeUndefined()
  })

  it('returns the description of a sentence not matching codeExceptions', () => {
    expect(
      isInCustody(
        [
          { supervisionPackage: { code: 'SPA' }, custody: { status: { code: 'B', description: 'Bailed' } } },
          { supervisionPackage: { code: 'SPB' }, custody: { status: { code: 'D', description: 'In Custody' } } },
        ],
        ['B'],
      ),
    ).toBe('In Custody')
  })
})
