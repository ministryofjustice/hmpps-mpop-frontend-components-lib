import { formatName } from './formatName'

describe('formatName', () => {
  it('returns empty string for null', () => {
    expect(formatName(null)).toBe('')
  })

  it('returns empty string for undefined', () => {
    expect(formatName(undefined)).toBe('')
  })

  it('returns empty string for empty string', () => {
    expect(formatName('')).toBe('')
  })

  it('capitalises the first letter of the forename and surname', () => {
    expect(formatName('jack frost')).toBe('Jack Frost')
  })

  it('leaves an already capitalised name unchanged', () => {
    expect(formatName('Jack Frost')).toBe('Jack Frost')
  })

  it('does not lowercase the remaining letters', () => {
    expect(formatName('ronald mcDonald')).toBe('Ronald McDonald')
  })

  it('capitalises each part of a hyphenated name', () => {
    expect(formatName('jane smith-jones')).toBe('Jane Smith-Jones')
  })

  it('capitalises the letter after an apostrophe', () => {
    expect(formatName("sean o'brien")).toBe("Sean O'Brien")
  })

  it('capitalises accented first letters', () => {
    expect(formatName('élodie ángel')).toBe('Élodie Ángel')
  })

  it('trims surrounding whitespace', () => {
    expect(formatName('  jack frost  ')).toBe('Jack Frost')
  })
})
