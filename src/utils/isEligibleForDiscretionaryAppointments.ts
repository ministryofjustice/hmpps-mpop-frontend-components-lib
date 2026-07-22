type Inputs = {
  gender?: string
  integratedOffenderManagementRedRated?: boolean
}

const eligibleTiers = ['C', 'D', 'E', 'F', 'G']

export const isEligibleForDiscretionaryAppointments = (inputs: Inputs | undefined, tierScore?: string): boolean =>
  inputs?.gender === 'Female' &&
  !inputs?.integratedOffenderManagementRedRated &&
  !!tierScore &&
  eligibleTiers.includes(tierScore)
