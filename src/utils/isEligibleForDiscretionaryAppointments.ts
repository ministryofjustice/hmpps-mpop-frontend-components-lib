type Context = {
  gender?: string
  integratedOffenderManagementRedRated?: boolean
}

const eligibleTiers = ['C', 'D', 'E', 'F', 'G']

export const isEligibleForDiscretionaryAppointments = (context: Context | undefined, tierScore?: string): boolean =>
  context?.gender === 'Female' &&
  !context?.integratedOffenderManagementRedRated &&
  !!tierScore &&
  eligibleTiers.includes(tierScore)
