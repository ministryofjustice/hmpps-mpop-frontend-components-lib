export type PersonalDetailsResponse = {
  personalDetails: PersonalDetailsSummary | null
  httpStatus: number
  error?: Error | null
}

export type PersonalDetailsSummary = {
  name: {
    forename: string
    middleName: string
    surname: string
  }
  crn: string
  offenderId: number
  pnc: string
  noms: string
  dateOfBirth: string
  age: string | null
}

export type SupervisionPackageResponse = {
  phase: {
    name: {
      code: string
      description: string
    }
    startDate: string
    endDate: string
    appointments: {
      allowance: number
      scheduled: number
      completed: number
    }
  }
}

export type SupervisionPackage = {
  supervisionPackageResponse: SupervisionPackageResponse | null
  httpStatus: number
  error?: Error | null
}
