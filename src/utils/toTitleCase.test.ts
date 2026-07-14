import { toTitleCase } from './toTitleCase'

describe('toTitleCase', () => {
  it('returns empty string for null', () => {
    expect(toTitleCase(null)).toBe('')
  })

  it('returns empty string for undefined', () => {
    expect(toTitleCase(undefined)).toBe('')
  })

  it('returns empty string for empty string', () => {
    expect(toTitleCase('')).toBe('')
  })

  it('capitalises the first letter of a lowercase string', () => {
    expect(toTitleCase('hello')).toBe('Hello')
  })

  it('lowercases subsequent letters', () => {
    expect(toTitleCase('HELLO')).toBe('Hello')
  })

  it('handles mixed case input', () => {
    expect(toTitleCase('hElLo')).toBe('Hello')
  })

  it('handles a single character', () => {
    expect(toTitleCase('a')).toBe('A')
  })
})
