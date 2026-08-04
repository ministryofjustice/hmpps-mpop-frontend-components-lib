import { sentenceType } from './sentenceType'
import { Inputs } from '../types/SupervisionPackage'

const buildInputs = (overrides: Partial<Inputs> = {}): Inputs =>
  ({
    sentences: [],
    ...overrides,
  }) as Inputs

describe('sentenceType', () => {
  it('returns false when inputs is undefined', () => {
    expect(sentenceType(undefined)).toBe(false)
  })

  it('returns false when inputs.sentences is undefined', () => {
    expect(sentenceType(buildInputs({ sentences: undefined }))).toBe(false)
  })

  it('returns "Imprisonment for Public Protection" when liferCategory code is LF01', () => {
    expect(
      sentenceType(
        buildInputs({
          liferCategory: { code: 'LF01' },
          sentences: [{ supervisionPackage: { code: 'SPA' }, type: { isCustodial: true } }] as Inputs['sentences'],
        }),
      ),
    ).toBe('Imprisonment for Public Protection')
  })

  it('returns "life sentence" when liferCategory is present without LF01 code', () => {
    expect(
      sentenceType(
        buildInputs({
          liferCategory: { code: 'LF03' },
          sentences: [{ supervisionPackage: { code: 'SPA' }, type: { isCustodial: true } }] as Inputs['sentences'],
        }),
      ),
    ).toBe('life sentence')
  })

  it('returns "extended determinate sentence" when liferCategory code is LF02', () => {
    expect(
      sentenceType(
        buildInputs({
          liferCategory: { code: 'LF02' },
          sentences: [{ supervisionPackage: { code: 'SPA' }, type: { isCustodial: true } }] as Inputs['sentences'],
        }),
      ),
    ).toBe('extended determinate sentence')
  })

  it('returns "custodial sentence" when a sentence is custodial and not SPX', () => {
    expect(
      sentenceType(
        buildInputs({
          sentences: [{ supervisionPackage: { code: 'SPA' }, type: { isCustodial: true } }] as Inputs['sentences'],
        }),
      ),
    ).toBe('custodial sentence')
  })

  it('returns "community sentence" when the only custodial sentence has code SPX', () => {
    expect(
      sentenceType(
        buildInputs({
          sentences: [{ supervisionPackage: { code: 'SPX' }, type: { isCustodial: true } }] as Inputs['sentences'],
        }),
      ),
    ).toBe('community sentence')
  })

  it('returns "community sentence" when no sentences are custodial', () => {
    expect(
      sentenceType(
        buildInputs({
          sentences: [{ supervisionPackage: { code: 'SPA' }, type: { isCustodial: false } }] as Inputs['sentences'],
        }),
      ),
    ).toBe('community sentence')
  })

  it('returns undefined when a sentence has no type (custodial status is unknown)', () => {
    expect(
      sentenceType(
        buildInputs({
          sentences: [{ supervisionPackage: { code: 'SPA' } }] as Inputs['sentences'],
        }),
      ),
    ).toBeUndefined()
  })
})
