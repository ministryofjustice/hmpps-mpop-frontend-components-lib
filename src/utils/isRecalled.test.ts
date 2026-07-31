import { isRecalled } from './isRecalled'

describe('isRecalled', () => {
  it('returns true when recallStatus has a code', () => {
    expect(isRecalled({ code: 'REC01', description: 'Recall initiated' })).toBe(true)
  })

  it('returns false when recallStatus has no code', () => {
    expect(isRecalled({ description: 'Recall initiated' })).toBe(false)
  })

  it('returns false when recallStatus is undefined', () => {
    expect(isRecalled(undefined)).toBe(false)
  })

  it('returns false when recallStatus is null', () => {
    expect(isRecalled(null)).toBe(false)
  })
})
