type Release = {
  releaseDate: string
  recallDate?: string
}

export type SupervisionPackageResponse = {
  supervisionPackage: CurrentPhase | null
  httpStatus: number
  error?: Error | null
}

type CodeDescription = {
  code: string
  description: string
}

type FinalThirdEligibility = {
  eligible: boolean
  since: string
}

type LiferCategory = {
  code?: string
  description?: string
}

type FrontendCustody = {
  status: CodeDescription
  location: CodeDescription
  finalThirdDate: string
  releases: Array<Release>
}

export type FrontendSentenceType = CodeDescription & {
  custodial: boolean
}

export type FrontendSentence = {
  eventNumber: string
  startDate: string
  endDate: string
  supervisionPackage: CodeDescription
  type: FrontendSentenceType
  custody: FrontendCustody
  inBreach: boolean
}

type PersonName = {
  forename: string
  middleNames: string
  surname: string
}

export type ContextDetails = {
  name: PersonName
  gender: string
  sentences: Array<FrontendSentence>
  integratedOffenderManagementRedRated: boolean
  offenderPersonalDisorderPathway: boolean
  intensiveSupervisionCourt: boolean
  nationalSecurityDivision: boolean
  contactSuspendedDate?: string
  finalThirdEligibility: FinalThirdEligibility
  liferCategory?: LiferCategory
  recallStatus?: CodeDescription
}

export type CurrentPhase = {
  supervisionPackage: CodeDescription
  phase: CodeDescription
  eventNumber: string
  startDate: string
  endDate: string
}

type EarlyEngagement = {
  startDate: string
  endDate: string
  weeks: number
  completed: number
}

type AppointmentAllowance = {
  allowance: number
  scheduled: number
  completed: number
}

type CurrentYear = {
  startDate: string
  endDate: string
  proRataFromDate: string
  appointments: AppointmentAllowance
  isFirstYear: boolean
}

type NextAppointment = {
  id: number
  date: string
  startTime: string
  type: CodeDescription
  description: string
}

export type SupervisionPackageFrontendContextResponse = {
  currentPhase: CurrentPhase
  earlyEngagement: EarlyEngagement
  currentYear: CurrentYear
  nextAppointment: NextAppointment
  createdAt: string
  updatedAt: string
  context: ContextDetails
}
