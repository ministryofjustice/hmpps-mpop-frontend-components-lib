import { isRecalled } from './isRecalled'

describe('isRecalled', () => {
  it('returns true when a sentence has custody status code C', () => {
    expect(isRecalled([{ custody: { status: { code: 'C', description: 'Recalled' } } }])).toBe(true)
  })

  it('returns false when the only sentence has custody status code other than C', () => {
    expect(isRecalled([{ custody: { status: { code: 'D', description: 'Custody' } } }])).toBe(false)
  })

  it('returns true when at least one of multiple sentences qualifies', () => {
    expect(
      isRecalled([
        { custody: { status: { code: 'D', description: 'Custody' } } },
        { custody: { status: { code: 'C', description: 'Recalled' } } },
      ]),
    ).toBe(true)
  })

  it('returns false when all sentences have custody status code other than C', () => {
    expect(
      isRecalled([
        { custody: { status: { code: 'D', description: 'Custody' } } },
        { custody: { status: { code: 'D', description: 'Custody' } } },
      ]),
    ).toBe(false)
  })

  it('returns false when custody is missing on a sentence', () => {
    expect(isRecalled([{}])).toBe(false)
  })

  it('returns false when sentences is undefined', () => {
    expect(isRecalled(undefined)).toBe(false)
  })

  it('returns false when sentences is null', () => {
    expect(isRecalled(null)).toBe(false)
  })

  it('returns false when sentences is an empty array', () => {
    expect(isRecalled([])).toBe(false)
  })
})
