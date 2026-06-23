import { yearsSince } from './yearsSince'

const FIXED_NOW = new Date('2026-06-24T12:00:00.000Z')

beforeEach(() => {
  jest.useFakeTimers()
  jest.setSystemTime(FIXED_NOW)
})

afterEach(() => {
  jest.useRealTimers()
})

describe('yearsSince', () => {
  it.each([
    ['empty string', '', null],
    ['blank string', '   ', null],
    ['invalid ISO string', 'not-a-date', null],
    ['date earlier today', '2026-06-24', '0'],
    ['less than a full year has passed', '2025-06-25', '0'],
    ['exactly one year ago', '2025-06-24', '1'],
    ['just over one year ago', '2025-06-23', '1'],
    ['exactly 30 years ago', '1996-06-24', '30'],
    ['truncates rather than rounds partial years (~30.5 years)', '1995-12-24', '30'],
  ])('returns %s for "%s"', (_description, input, expected) => {
    expect(yearsSince(input)).toBe(expected)
  })
})
