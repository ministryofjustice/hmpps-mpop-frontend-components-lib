import { getPrimarySentence, isSpxOnlySentenceList } from './getPrimarySentence'
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

  // Falls back to the highest event number sentence when the only sentence is SPX
  it('returns the sentence when there is only one sentence and it is SPX', () => {
    expect(getPrimarySentence([{ supervisionPackage: { code: 'SPX' } }] as FrontendSentence[])).toEqual({
      supervisionPackage: { code: 'SPX' },
    })
  })

  // Falls back to the highest event number sentence when no sentence is a valid primary
  it('returns the highest event number sentence when multiple sentences exist but none is a valid primary', () => {
    const result = getPrimarySentence([
      { supervisionPackage: { code: 'SPX' } },
      { supervisionPackage: { code: 'SPX' } },
    ] as FrontendSentence[])

    expect(result).toEqual({ supervisionPackage: { code: 'SPX' } })
  })

  // Regression test: the fallback should pick the highest event number among non-terminated sentences
  it('returns the sentence with the highest event number when none are terminated', () => {
    const result = getPrimarySentence([
      {
        eventNumber: '1',
        supervisionPackage: { code: 'SPX' },
        custody: { status: { code: 'B', description: 'On Licence' } },
      },
      {
        eventNumber: '3',
        supervisionPackage: { code: 'SPX' },
        custody: { status: { code: 'B', description: 'On Licence' } },
      },
      {
        eventNumber: '2',
        supervisionPackage: { code: 'SPX' },
        custody: { status: { code: 'B', description: 'On Licence' } },
      },
    ] as FrontendSentence[])

    expect(result).toEqual(expect.objectContaining({ eventNumber: '3' }))
  })

  // Regression test: a terminated sentence must not win even if it has a higher event number
  it('excludes a terminated sentence even when it has a higher event number than the current highest', () => {
    const result = getPrimarySentence([
      {
        eventNumber: '1',
        supervisionPackage: { code: 'SPX' },
        custody: { status: { code: 'B', description: 'On Licence' } },
      },
      {
        eventNumber: '5',
        supervisionPackage: { code: 'SPX' },
        custody: { status: { code: 'T', description: 'Terminated' } },
      },
      {
        eventNumber: '2',
        supervisionPackage: { code: 'SPX' },
        custody: { status: { code: 'B', description: 'On Licence' } },
      },
    ] as FrontendSentence[])

    expect(result).toEqual(expect.objectContaining({ eventNumber: '2' }))
  })

  // Regression test: termination must be identified by the status code, not the description text
  it('does not exclude a sentence whose description says terminated but whose status code is not T', () => {
    const result = getPrimarySentence([
      {
        eventNumber: '1',
        supervisionPackage: { code: 'SPX' },
        custody: { status: { code: 'B', description: 'On Licence' } },
      },
      {
        eventNumber: '4',
        supervisionPackage: { code: 'SPX' },
        custody: { status: { code: 'B', description: 'Terminated' } },
      },
    ] as FrontendSentence[])

    expect(result).toEqual(expect.objectContaining({ eventNumber: '4' }))
  })

  // Regression test: the single-sentence shortcut must not bypass the termination check
  it('returns false when there is only one sentence and it is terminated', () => {
    const result = getPrimarySentence([
      { supervisionPackage: { code: 'SPA' }, custody: { status: { code: 'T', description: 'Terminated' } } },
    ] as FrontendSentence[])

    expect(result).toBe(false)
  })

  // Regression test: the single-sentence shortcut must not bypass the termination check
  it('returns the sentence when there is only one sentence and it is not terminated', () => {
    const result = getPrimarySentence([{ supervisionPackage: { code: 'SPA' } }] as FrontendSentence[])

    expect(result).toEqual({ supervisionPackage: { code: 'SPA' } })
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

  it('returns the single sentence when there is only one and it has no supervision package', () => {
    const sentence = {} as FrontendSentence

    expect(getPrimarySentence([sentence])).toBe(sentence)
  })

  it('returns the single sentence when there is only one and it is not SPX', () => {
    expect(getPrimarySentence([{ supervisionPackage: { code: 'SPA' } }] as FrontendSentence[])).toEqual({
      supervisionPackage: { code: 'SPA' },
    })
  })

  describe('isTerminated used within findSPSentence', () => {
    it('skips a terminated non-SPX sentence and picks the next non-terminated non-SPX sentence', () => {
      const result = getPrimarySentence([
        {
          eventNumber: '1',
          supervisionPackage: { code: 'SPA' },
          custody: { status: { code: 'T', description: 'Terminated' } },
        },
        {
          eventNumber: '2',
          supervisionPackage: { code: 'SPB' },
          custody: { status: { code: 'B', description: 'On Licence' } },
        },
      ] as FrontendSentence[])

      expect(result).toEqual(expect.objectContaining({ eventNumber: '2' }))
    })

    it('does not exclude a sentence from findSPSentence when its status code is not T', () => {
      const result = getPrimarySentence([
        {
          eventNumber: '1',
          supervisionPackage: { code: 'SPA' },
          custody: { status: { code: 'B', description: 'Terminated' } },
        },
        {
          eventNumber: '2',
          supervisionPackage: { code: 'SPB' },
          custody: { status: { code: 'B', description: 'On Licence' } },
        },
      ] as FrontendSentence[])

      expect(result).toEqual(expect.objectContaining({ eventNumber: '1' }))
    })
  })

  describe('isTerminated used within findHighestEventNumberSentence', () => {
    it('falls back to the highest event number sentence when no non-terminated sentence has a supervisionPackage', () => {
      const result = getPrimarySentence([
        {
          eventNumber: '1',
          supervisionPackage: { code: 'SPX' },
          custody: { status: { code: 'B', description: 'On Licence' } },
        },
        {
          eventNumber: '3',
          supervisionPackage: { code: 'SPX' },
          custody: { status: { code: 'B', description: 'On Licence' } },
        },
      ] as FrontendSentence[])

      expect(result).toEqual(expect.objectContaining({ eventNumber: '3' }))
    })

    it('returns false when every candidate is terminated', () => {
      const result = getPrimarySentence([
        {
          eventNumber: '1',
          supervisionPackage: { code: 'SPX' },
          custody: { status: { code: 'T', description: 'Terminated' } },
        },
        {
          eventNumber: '2',
          supervisionPackage: { code: 'SPX' },
          custody: { status: { code: 'T', description: 'Terminated' } },
        },
      ] as FrontendSentence[])

      expect(result).toBe(false)
    })

    // Regression test: a terminated sentence seeded as the reduce accumulator must not be returned
    it('excludes a terminated sentence that appears first in the array even with the highest event number', () => {
      const result = getPrimarySentence([
        {
          eventNumber: '5',
          supervisionPackage: { code: 'SPX' },
          custody: { status: { code: 'T', description: 'Terminated' } },
        },
        {
          eventNumber: '2',
          supervisionPackage: { code: 'SPX' },
          custody: { status: { code: 'B', description: 'On Licence' } },
        },
      ] as FrontendSentence[])

      expect(result).toEqual(expect.objectContaining({ eventNumber: '2' }))
    })
  })
})

describe('isSpxOnlySentenceList', () => {
  it('returns false when sentences is undefined', () => {
    expect(isSpxOnlySentenceList(undefined)).toBe(false)
  })

  it('returns false when sentences is null', () => {
    expect(isSpxOnlySentenceList(null)).toBe(false)
  })

  it('returns false when sentences is empty', () => {
    expect(isSpxOnlySentenceList([])).toBe(false)
  })

  it('returns true when every sentence is SPX', () => {
    expect(
      isSpxOnlySentenceList([
        { supervisionPackage: { code: 'SPX' } },
        { supervisionPackage: { code: 'SPX' } },
      ] as FrontendSentence[]),
    ).toBe(true)
  })

  it('returns false when at least one sentence is not SPX', () => {
    expect(
      isSpxOnlySentenceList([
        { supervisionPackage: { code: 'SPX' } },
        { supervisionPackage: { code: 'SPA' } },
      ] as FrontendSentence[]),
    ).toBe(false)
  })

  it('returns false when a sentence has no supervisionPackage', () => {
    expect(isSpxOnlySentenceList([{} as FrontendSentence])).toBe(false)
  })
})
