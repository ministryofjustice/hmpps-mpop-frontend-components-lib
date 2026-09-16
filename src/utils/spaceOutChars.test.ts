import { spaceOutChars } from './spaceOutChars'

describe('spaceOutChars', () => {
  it('inserts a space between each character', () => {
    expect(spaceOutChars('X123456')).toBe('X 1 2 3 4 5 6')
  })

  it('returns an empty string when given an empty string', () => {
    expect(spaceOutChars('')).toBe('')
  })

  it('returns an empty string when given null', () => {
    expect(spaceOutChars(null)).toBe('')
  })

  it('returns an empty string when given undefined', () => {
    expect(spaceOutChars(undefined)).toBe('')
  })
})
