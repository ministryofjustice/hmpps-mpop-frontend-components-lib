import { dateWithYear, dateToLongDate, dateWithYearTimeFirst } from './dateWithYear'

const FIXED_NOW = new Date('2026-06-24T12:00:00.000Z')

beforeEach(() => {
  jest.useFakeTimers()
  jest.setSystemTime(FIXED_NOW)
})

afterEach(() => {
  jest.useRealTimers()
})

describe('dateWithYear', () => {
  it.each([
    ['null input', null as unknown as string, undefined, null],
    ['empty string', '', undefined, null],
    ['blank string', '   ', undefined, null],
    ['invalid ISO string', 'not-a-date', undefined, null],
    ['date-only ISO string', '2025-03-15', undefined, '15 March 2025'],
    ['datetime ISO string without showTime', '2025-03-15T10:30:00.000Z', undefined, '15 March 2025'],
    ['datetime on the hour with showTime', '2025-03-15T10:00:00.000+00:00', true, '15 March 2025 at 10am'],
    ['datetime with minutes with showTime', '2025-03-15T10:30:00.000+00:00', true, '15 March 2025 at 10:30am'],
  ])('returns %s for "%s"', (_description, input, showTime, expected) => {
    expect(dateWithYear(input, showTime)).toBe(expected)
  })
})

describe('dateToLongDate', () => {
  it.each([
    ['null input', null as unknown as string, null],
    ['empty string', '', null],
    ['blank string', '   ', null],
    ['invalid date format', 'not-a-date', 'not-a-date'],
    ['valid past date', '15/03/1990', '15 March 1990'],
    ['today', '24/06/2026', '24 June 2026'],
    ['future date (fail-safe for DOB)', '01/01/2027', null],
  ])('returns %s for "%s"', (_description, input, expected) => {
    expect(dateToLongDate(input)).toBe(expected)
  })
})

describe('dateWithYearTimeFirst', () => {
  it.each([
    ['null input', null as unknown as string, ''],
    ['empty string', '', ''],
    ['blank string', '   ', ''],
    ['invalid ISO string', 'not-a-date', ''],
    ['date-only ISO string', '2025-03-15', '12am 15 March 2025'],
    ['datetime with minutes', '2025-03-15T10:30:00.000+00:00', '10:30am 15 March 2025'],
    ['datetime on the hour', '2025-03-15T10:00:00.000+00:00', '10am 15 March 2025'],
  ])('returns %s for "%s"', (_description, input, expected) => {
    expect(dateWithYearTimeFirst(input)).toBe(expected)
  })
})
