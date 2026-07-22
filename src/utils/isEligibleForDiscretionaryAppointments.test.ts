import { isEligibleForDiscretionaryAppointments } from './isEligibleForDiscretionaryAppointments'

describe('isEligibleForDiscretionaryAppointments', () => {
  it.each`
    tierScore
    ${'C'}
    ${'D'}
    ${'E'}
    ${'F'}
    ${'G'}
  `('returns true when gender is Female, not IOM red rated and tierScore is $tierScore', ({ tierScore }) => {
    expect(
      isEligibleForDiscretionaryAppointments(
        { gender: 'Female', integratedOffenderManagementRedRated: false },
        tierScore,
      ),
    ).toBe(true)
  })

  it('returns false when tierScore is not one of C, D, E, F or G', () => {
    expect(
      isEligibleForDiscretionaryAppointments({ gender: 'Female', integratedOffenderManagementRedRated: false }, 'B'),
    ).toBe(false)
  })

  it('returns false when gender is not Female', () => {
    expect(
      isEligibleForDiscretionaryAppointments({ gender: 'Male', integratedOffenderManagementRedRated: false }, 'C'),
    ).toBe(false)
  })

  it('returns false when integratedOffenderManagementRedRated is true', () => {
    expect(
      isEligibleForDiscretionaryAppointments({ gender: 'Female', integratedOffenderManagementRedRated: true }, 'C'),
    ).toBe(false)
  })

  it('returns false when inputs is undefined', () => {
    expect(isEligibleForDiscretionaryAppointments(undefined, 'C')).toBe(false)
  })
})
