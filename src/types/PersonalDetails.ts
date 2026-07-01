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
  inputs: {
    date: string
    gender: string
    opd: boolean
    iomRedRated: boolean
    intensiveSupervisionCourt: boolean
    nationalSecurityDivision: boolean
    finalThirdEligible: boolean
    finalThirdDate: string
    contactSuspendedDate: string
    sentences: Array<Sentence>
  }
}

type Sentence = {
  eventNumber: number
  startDate: string
  endDate: string
  inBreach: boolean
  supervisionPackage: {
    code: string
    description: string
  }
  type: {
    description: string
    isCustodial: boolean
  }
  custody: {
    status: {
      code: string
      description: string
    }
    releases: Array<Release>
  }
}

type Release = {
  releaseDate: string
  recallDate: string
}

export type SupervisionPackage = {
  supervisionPackageResponse: SupervisionPackageResponse | null
  httpStatus: number
  error?: Error | null
}
