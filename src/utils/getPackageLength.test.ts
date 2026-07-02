import { gestPackageLength } from './getPackageLength'

describe('gestPackageLength', () => {
  it.each([
    ['same day', '2025-01-01', '2025-01-01', 0],
    ['one month apart', '2025-01-01', '2025-02-01', 1],
    ['exactly 12 months apart', '2025-01-01', '2026-01-01', 12],
    ['6 months apart', '2025-03-15', '2025-09-15', 6],
    ['rounds up at midpoint', '2025-01-01', '2025-01-17', 1],
    ['rounds down below midpoint', '2025-01-01', '2025-01-14', 0],
    ['end before start returns negative', '2025-06-01', '2025-01-01', -5],
    ['cross year boundary', '2024-11-01', '2025-02-01', 3],
  ])('%s: returns %d for "%s" to "%s"', (_description, startDate, endDate, expected) => {
    expect(gestPackageLength(startDate, endDate)).toBe(expected)
  })
})
