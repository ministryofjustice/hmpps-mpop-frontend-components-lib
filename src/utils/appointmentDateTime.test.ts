import { appointmentDateTime } from './appointmentDateTime'

const FIXED_NOW = new Date('2026-06-24T12:00:00.000Z')

beforeEach(() => {
  jest.useFakeTimers()
  jest.setSystemTime(FIXED_NOW)
})

afterEach(() => {
  jest.useRealTimers()
})

describe('appointmentDateTime', () => {
  it.each([
    ['null date', null as unknown as string, '12:00:00', null],
    ['empty date', '', '12:00:00', null],
    ['blank date', '   ', '12:00:00', null],
    ['invalid date', 'not-a-date', '12:00:00', null],
    ['null startTime', '2026-08-13', null as unknown as string, null],
    ['empty startTime', '2026-08-13', '', null],
    ['on-the-hour time', '2026-08-13', '12:00:00', 'Thursday 13 Aug at 12pm'],
    ['time with minutes', '2026-08-13', '09:15:00', 'Thursday 13 Aug at 9:15am'],
    ['midnight', '2026-08-13', '00:00:00', 'Thursday 13 Aug at 12am'],
  ])('returns %s for date "%s" and startTime "%s"', (_description, date, startTime, expected) => {
    expect(appointmentDateTime(date, startTime)).toBe(expected)
  })
})
