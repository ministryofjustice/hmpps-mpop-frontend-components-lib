export type SupervisionPackage = {
  phase: {
    name: {
      code: string
      description: string
    }
    startDate: string
    endDate: string
  }
  earlyEngagement: {
    startDate: string
    endDate: string
    weeks: number
    completed: number
  }
  currentYear: {
    startDate: string
    endDate: string
    appointments: {
      allowance: number
      scheduled: number
      completed: number
    }
    firstYear: boolean
  }
  inputs: {
    date: string
    gender: string
    integratedOffenderManagementRedRated: boolean
    offenderPersonalDisorderPathway: boolean
    intensiveSupervisionCourt: boolean
    nationalSecurityDivision: boolean
    contactSuspendedDate: string
    finalThirdEligibility: {
      eligible: boolean
      since: string
    }
    sentences: {
      eventNumber: string
      startDate: string
      endDate: string
      supervisionPackage: {
        code: string
        description: string
      }
      type: {
        code: string
        description: string
        custodial: boolean
      }
      custody: {
        status: {
          code: string
          description: string
        }
        finalThirdDate: string
        releases: {
          releaseDate: string
          recallDate: string
        }[]
      }
      inBreach: boolean
    }[]
  }
}

export type SupervisionPackageResponse = {
  supervisionPackage: SupervisionPackage | null
  httpStatus: number
  error?: Error | null
}
