import { isInCustody } from './isInCustody'
import { FrontendSentence } from '../types/SupervisionPackage'

describe('isInCustody', () => {
  it.each(['D', 'I', 'R'])('returns the description when a sentence has custody status code %s', code => {
    expect(
      isInCustody([
        { supervisionPackage: { code: 'SPA' }, custody: { status: { code, description: 'In custody' } } },
      ] as FrontendSentence[]),
    ).toBe('In custody')
  })

  it('returns undefined when no sentence has a custody status code', () => {
    expect(
      isInCustody([{ supervisionPackage: { code: 'SPA' }, custody: { status: {} } }] as FrontendSentence[]),
    ).toBeUndefined()
  })

  it('returns the description of the first matching sentence when multiple sentences qualify', () => {
    expect(
      isInCustody([
        { supervisionPackage: { code: 'SPX' }, custody: { status: { code: 'D', description: 'In custody' } } },
        { supervisionPackage: { code: 'SPA' }, custody: { status: { code: 'C', description: 'Community custody' } } },
        { supervisionPackage: { code: 'SPB' }, custody: { status: { code: 'I', description: 'In custody - IRC' } } },
      ] as FrontendSentence[]),
    ).toBe('In custody')
  })

  it('returns undefined when sentences is undefined', () => {
    expect(isInCustody(undefined)).toBeUndefined()
  })

  it('returns undefined when sentences is an empty array', () => {
    expect(isInCustody([])).toBeUndefined()
  })

  it('returns the description when a sentence matches a custom codes list', () => {
    expect(
      isInCustody(
        [
          { supervisionPackage: { code: 'SPA' }, custody: { status: { code: 'B', description: 'Bailed' } } },
        ] as FrontendSentence[],
        ['B'],
      ),
    ).toBe('Bailed')
  })

  it('returns undefined when no sentence matches the custom codes list', () => {
    expect(
      isInCustody(
        [
          { supervisionPackage: { code: 'SPA' }, custody: { status: { code: 'B', description: 'Bailed' } } },
          { supervisionPackage: { code: 'SPB' }, custody: { status: { code: 'D', description: 'In custody' } } },
        ] as FrontendSentence[],
        ['X'],
      ),
    ).toBeUndefined()
  })
})
