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

  describe('preservedWords', () => {
    it('preserves "(NS)" casing when input is lowercase', () => {
      expect(toTitleCase('example (ns) text')).toBe('Example (NS) text')
    })

    it('preserves "(NS)" casing when input is uppercase', () => {
      expect(toTitleCase('EXAMPLE (NS) TEXT')).toBe('Example (NS) text')
    })

    it('preserves "(Non" casing within a longer word', () => {
      expect(toTitleCase('example (non-statutory) text')).toBe('Example (Non-statutory) text')
    })

    it('preserves "NS)" casing when not part of "(NS)"', () => {
      expect(toTitleCase('example ns) text')).toBe('Example NS) text')
    })

    it('preserves multiple preserved words in the same string', () => {
      expect(toTitleCase('order (ns) and (non) compliant ns)')).toBe('Order (NS) and (Non) compliant NS)')
    })

    it('does not affect text without preserved words', () => {
      expect(toTitleCase('no special words here')).toBe('No special words here')
    })
  })
})
