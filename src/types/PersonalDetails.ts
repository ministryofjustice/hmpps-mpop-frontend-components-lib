import type { ApiResponse } from './ApiResponse'

export type PersonalDetailsResponse = ApiResponse & {
  personalDetails: PersonalDetailsSummary | null
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
