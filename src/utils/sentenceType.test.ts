import { sentenceType } from './sentenceType'
import { ContextDetails } from '../types/SupervisionPackage'

const buildContextDetails = (overrides: Partial<ContextDetails> = {}): ContextDetails =>
  ({
    sentences: [],
    ...overrides,
  }) as ContextDetails

describe('sentenceType', () => {
  it('returns false when context is undefined', () => {
    expect(sentenceType(undefined)).toBe(false)
  })

  it('returns false when context.sentences is undefined', () => {
    expect(sentenceType(buildContextDetails({ sentences: undefined }))).toBe(false)
  })

  it('returns "Imprisonment for Public Protection" when liferCategory code is LF01', () => {
    expect(
      sentenceType(
        buildContextDetails({
          liferCategory: { code: 'LF01' },
          sentences: [
            { supervisionPackage: { code: 'SPA' }, type: { isCustodial: true } },
          ] as ContextDetails['sentences'],
        }),
      ),
    ).toBe('Imprisonment for Public Protection')
  })

  it('returns "life sentence" when liferCategory is present without LF01 code', () => {
    expect(
      sentenceType(
        buildContextDetails({
          liferCategory: { code: 'LF03' },
          sentences: [
            { supervisionPackage: { code: 'SPA' }, type: { isCustodial: true } },
          ] as ContextDetails['sentences'],
        }),
      ),
    ).toBe('life sentence')
  })

  it('returns "extended determinate sentence" when liferCategory code is LF02', () => {
    expect(
      sentenceType(
        buildContextDetails({
          liferCategory: { code: 'LF02' },
          sentences: [
            { supervisionPackage: { code: 'SPA' }, type: { isCustodial: true } },
          ] as ContextDetails['sentences'],
        }),
      ),
    ).toBe('extended determinate sentence')
  })

  it('returns "custodial sentence" when a sentence is custodial and not SPX', () => {
    expect(
      sentenceType(
        buildContextDetails({
          sentences: [
            { supervisionPackage: { code: 'SPA' }, type: { isCustodial: true } },
          ] as ContextDetails['sentences'],
        }),
      ),
    ).toBe('custodial sentence')
  })

  it('returns "community sentence" when no sentences are custodial', () => {
    expect(
      sentenceType(
        buildContextDetails({
          sentences: [
            { supervisionPackage: { code: 'SPA' }, type: { isCustodial: false } },
          ] as ContextDetails['sentences'],
        }),
      ),
    ).toBe('community sentence')
  })

  it('returns undefined when a sentence has no type (custodial status is unknown)', () => {
    expect(
      sentenceType(
        buildContextDetails({
          sentences: [{ supervisionPackage: { code: 'SPA' } }] as ContextDetails['sentences'],
        }),
      ),
    ).toBeUndefined()
  })
})
