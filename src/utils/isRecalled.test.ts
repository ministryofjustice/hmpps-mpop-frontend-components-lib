import { isRecalled } from './isRecalled'
import { FrontendSentence } from '../types/SupervisionPackage'

describe('isRecalled', () => {
  it('returns true when the custody status code is C', () => {
    expect(isRecalled({ custody: { status: { code: 'C' } } } as FrontendSentence)).toBe(true)
  })

  it('is case-insensitive', () => {
    expect(isRecalled({ custody: { status: { code: 'c' } } } as FrontendSentence)).toBe(true)
  })

  it('returns false for a different custody status code', () => {
    expect(isRecalled({ custody: { status: { code: 'R' } } } as FrontendSentence)).toBe(false)
  })

  it('returns false when sentence is undefined', () => {
    expect(isRecalled(undefined)).toBe(false)
  })
})
