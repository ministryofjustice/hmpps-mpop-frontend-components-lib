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

  it('returns false when a sentence has no type (custodial status is unknown) and code is not a suspended sentence code', () => {
    expect(
      sentenceType(
        buildContextDetails({
          sentences: [{ supervisionPackage: { code: 'SPA' } }] as ContextDetails['sentences'],
        }),
      ),
    ).toBe(false)
  })

  it('returns false when there is no primary sentence', () => {
    expect(
      sentenceType(
        buildContextDetails({
          sentences: [{ supervisionPackage: { code: 'SPX' } }] as ContextDetails['sentences'],
        }),
      ),
    ).toBe(false)
  })

  it.each(['203', '216', '330', '341', '408'])(
    'returns "suspended sentence" when the primary sentence type code is %s',
    code => {
      expect(
        sentenceType(
          buildContextDetails({
            sentences: [
              { supervisionPackage: { code: 'SPA' }, type: { code, isCustodial: false } },
            ] as ContextDetails['sentences'],
          }),
        ),
      ).toBe('suspended sentence')
    },
  )

  it('returns "custodial sentence" when the primary sentence type code is a suspended sentence code but isCustodial is true', () => {
    expect(
      sentenceType(
        buildContextDetails({
          sentences: [
            { supervisionPackage: { code: 'SPA' }, type: { code: '203', isCustodial: true } },
          ] as ContextDetails['sentences'],
        }),
      ),
    ).toBe('custodial sentence')
  })
})
