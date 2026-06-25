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
