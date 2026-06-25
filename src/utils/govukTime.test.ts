import { govukTime } from './govukTime'

describe('govukTime', () => {
  it.each([
    ['undefined input', undefined, null],
    ['empty string', '', null],
    ['blank string', '   ', null],
    ['invalid ISO string', 'not-a-date', null],
    ['on-the-hour am time', '2025-03-15T10:00:00.000+00:00', '10am'],
    ['am time with minutes', '2025-03-15T10:30:00.000+00:00', '10:30am'],
    ['pm time on the hour', '2025-03-15T14:00:00.000+00:00', '2pm'],
    ['pm time with minutes', '2025-03-15T14:45:00.000+00:00', '2:45pm'],
    ['midnight', '2025-03-15T00:00:00.000+00:00', '12am'],
    ['noon', '2025-03-15T12:00:00.000+00:00', '12pm'],
  ])('returns %s for "%s"', (_description, input, expected) => {
    expect(govukTime(input)).toBe(expected)
  })
})
