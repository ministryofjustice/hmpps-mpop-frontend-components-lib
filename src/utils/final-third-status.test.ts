import { finalThirdStatus } from './finalThirdStatus'

describe('finalThirdStatus', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('returns Not Started when today is before the Final Third date', () => {
    jest.setSystemTime(new Date('2026-11-01'))

    expect(finalThirdStatus('2026-11-07', '2027-01-07')).toEqual({
      text: 'Not Started',
      tagClass: 'govuk-tag--blue',
    })
  })

  it('returns In Progress when today is the Final Third date', () => {
    jest.setSystemTime(new Date('2026-11-07'))

    expect(finalThirdStatus('2026-11-07', '2027-01-07')).toEqual({
      text: 'In Progress',
      tagClass: 'govuk-tag--green',
    })
  })

  it('returns In Progress when today is after the Final Third date but before the sentence end date', () => {
    jest.setSystemTime(new Date('2026-12-01'))

    expect(finalThirdStatus('2026-11-07', '2027-01-07')).toEqual({
      text: 'In Progress',
      tagClass: 'govuk-tag--green',
    })
  })

  it('returns Ended when today is the sentence end date', () => {
    jest.setSystemTime(new Date('2027-01-07'))

    expect(finalThirdStatus('2026-11-07', '2027-01-07')).toEqual({
      text: 'Ended',
      tagClass: 'govuk-tag--grey',
    })
  })

  it('returns Ended when today is after the sentence end date', () => {
    jest.setSystemTime(new Date('2027-02-01'))

    expect(finalThirdStatus('2026-11-07', '2027-01-07')).toEqual({
      text: 'Ended',
      tagClass: 'govuk-tag--grey',
    })
  })

  it('returns Not Started when the Final Third date is missing', () => {
    jest.setSystemTime(new Date('2026-11-01'))

    expect(finalThirdStatus(undefined, '2027-01-07')).toEqual({
      text: 'Not Started',
      tagClass: 'govuk-tag--blue',
    })
  })
})