import { getPrimarySentence, isTerminated } from './getPrimarySentence'
import { FrontendSentence } from '../types/SupervisionPackage'

describe('getPrimarySentence', () => {
  it('returns the sentence flagged as isPrimarySentence', () => {
    const result = getPrimarySentence([
      { eventNumber: '1', isPrimarySentence: false },
      { eventNumber: '2', isPrimarySentence: true },
      { eventNumber: '3', isPrimarySentence: false },
    ] as FrontendSentence[])

    expect(result).toEqual(expect.objectContaining({ eventNumber: '2' }))
  })

  // Regression test: the flag is the sole source of truth, not SPX code or event number ordering
  it('returns the flagged sentence even when it has a lower event number and is SPX', () => {
    const result = getPrimarySentence([
      { eventNumber: '5', supervisionPackage: { code: 'SPA' }, isPrimarySentence: false },
      { eventNumber: '1', supervisionPackage: { code: 'SPX' }, isPrimarySentence: true },
    ] as FrontendSentence[])

    expect(result).toEqual(expect.objectContaining({ eventNumber: '1' }))
  })

  // Regression test: termination status must not influence selection any more
  it('returns the flagged sentence even when it is terminated', () => {
    const result = getPrimarySentence([
      {
        eventNumber: '1',
        isPrimarySentence: true,
        custody: { status: { code: 'T', description: 'Terminated' } },
      },
    ] as FrontendSentence[])

    expect(result).toEqual(expect.objectContaining({ eventNumber: '1' }))
  })

  it('returns false when no sentence is flagged as isPrimarySentence', () => {
    const result = getPrimarySentence([
      { eventNumber: '1', isPrimarySentence: false },
      { eventNumber: '2', isPrimarySentence: false },
    ] as FrontendSentence[])

    expect(result).toBe(false)
  })

  it('returns false when there is only one sentence and it is not flagged', () => {
    expect(getPrimarySentence([{ isPrimarySentence: false }] as FrontendSentence[])).toBe(false)
  })

  it('returns the single sentence when there is only one and it is flagged', () => {
    const sentence = { isPrimarySentence: true } as FrontendSentence

    expect(getPrimarySentence([sentence])).toBe(sentence)
  })

  it('returns false when sentences is undefined', () => {
    expect(getPrimarySentence(undefined)).toBe(false)
  })

  it('returns false when sentences is null', () => {
    expect(getPrimarySentence(null)).toBe(false)
  })

  it('returns false when sentences is empty', () => {
    expect(getPrimarySentence([])).toBe(false)
  })

  // Regression test: only the first flagged sentence should win if more than one is (incorrectly) flagged
  it('returns the first flagged sentence when more than one is flagged', () => {
    const result = getPrimarySentence([
      { eventNumber: '1', isPrimarySentence: true },
      { eventNumber: '2', isPrimarySentence: true },
    ] as FrontendSentence[])

    expect(result).toEqual(expect.objectContaining({ eventNumber: '1' }))
  })
})

describe('isTerminated', () => {
  it('returns true when the custody status code is T', () => {
    expect(isTerminated({ custody: { status: { code: 'T', description: 'Terminated' } } } as FrontendSentence)).toBe(
      true,
    )
  })

  // Regression test: termination must be identified by the status code, not the description text
  it('returns false when the description says terminated but the status code is not T', () => {
    expect(isTerminated({ custody: { status: { code: 'B', description: 'Terminated' } } } as FrontendSentence)).toBe(
      false,
    )
  })

  it('returns false when there is no custody status', () => {
    expect(isTerminated({} as FrontendSentence)).toBe(false)
  })

  it('returns false when the sentence is undefined', () => {
    expect(isTerminated(undefined)).toBe(false)
  })

  it('returns false when the sentence is null', () => {
    expect(isTerminated(null)).toBe(false)
  })
})
