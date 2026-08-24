import { supervisionAppointmentsReset } from './supervisionAppointmentsReset'
import { FrontendSentence } from '../types/SupervisionPackage'

describe('supervisionAppointmentsReset', () => {
  it('returns true when the primary sentence ends after the current year end date', () => {
    expect(
      supervisionAppointmentsReset('2027-02-02', [
        { supervisionPackage: { code: 'SPA' }, endDate: '2028-06-15' },
      ] as FrontendSentence[]),
    ).toBe(true)
  })

  it('returns false when the primary sentence ends before the current year end date', () => {
    expect(
      supervisionAppointmentsReset('2027-02-02', [
        { supervisionPackage: { code: 'SPA' }, endDate: '2026-06-15' },
      ] as FrontendSentence[]),
    ).toBe(false)
  })

  it('returns false when the primary sentence ends on the current year end date', () => {
    expect(
      supervisionAppointmentsReset('2027-02-02', [
        { supervisionPackage: { code: 'SPA' }, endDate: '2027-02-02' },
      ] as FrontendSentence[]),
    ).toBe(false)
  })

  it('returns true when the primary sentence among SPX sentences ends after the current year end date', () => {
    expect(
      supervisionAppointmentsReset('2027-02-02', [
        { supervisionPackage: { code: 'SPX' }, endDate: '2026-06-15' },
        { supervisionPackage: { code: 'SPA' }, endDate: '2028-06-15' },
      ] as FrontendSentence[]),
    ).toBe(true)
  })

  it('returns false when there is no primary sentence', () => {
    expect(supervisionAppointmentsReset('2027-02-02', [] as FrontendSentence[])).toBe(false)
  })

  it('returns false when the primary sentence has no end date', () => {
    expect(
      supervisionAppointmentsReset('2027-02-02', [{ supervisionPackage: { code: 'SPA' } }] as FrontendSentence[]),
    ).toBe(false)
  })
})
