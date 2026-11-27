import type { Prisoner } from './Prisoner'
import type { SupervisionPackageFrontendContextResponse } from './SupervisionPackage'

export type SupervisionPackageContext = {
  supervisionPackage: SupervisionPackageFrontendContextResponse | null
  unavailable: boolean
}

export type PersonHeaderStatusOptions = {
  personalDetails: { crn?: string; noms?: string | null; dateOfDeath?: string }
  supervisionPackage?: SupervisionPackageFrontendContextResponse | null
  supervisionPackageUnavailable?: boolean
}

export type PersonHeaderStatus = {
  personStatusTag?: string
  statusUnavailable: boolean
  prisoner?: Prisoner
  prisonerUnavailable: boolean
}
