import { isBlank } from './isBlank'

describe('isBlank', () => {
  it.each([
    ['empty string', '', true],
    ['string of spaces', '   ', true],
    ['string of tabs and newlines', '\t\n', true],
    ['non-empty string', 'hello', false],
    ['string with leading/trailing spaces but non-whitespace content', '  hello  ', false],
  ])('returns %s for "%s"', (_description, input, expected) => {
    expect(isBlank(input)).toBe(expected)
  })
})
