export type PersonSchedule = {
  personSummary: {
    name: {
      forename: string
      middleName?: string
      surname: string
      username?: string
    }
    crn: string
    offenderId?: number
    pnc?: string
    dateOfBirth: string
    preferredLanguage?: string
  }
  personSchedule: {
    size: number
    page: number
    totalResults: number
    totalPages: number
    appointments: Array<Activity>
  }
}

export type PersonScheduleResponse = {
  personSchedule: PersonSchedule | null
  httpStatus: number
  error?: Error | null
}

type Activity = {
  id: string
  eventNumber?: string
  type: string
  displayName?: string
  startDateTime: string
  endDateTime?: string
  rarToolKit?: string
  appointmentNotes?: Array<Note>
  appointmentNote?: Note
  isSensitive?: boolean
  hasOutcome?: boolean
  wasAbsent?: boolean
  officer?: {
    code?: string
    name?: {
      forename: string
      middleName?: string
      surname: string
      username?: string
    }
    teamCode?: string
    providerCode?: string
    username?: string
  }
  isInitial?: boolean
  isNationalStandard?: boolean
  location?: {
    code?: string
    providerCode?: string
    teamCode?: string
    officeName?: string
    buildingName?: string
    buildingNumber?: string
    streetName?: string
    district?: string
    town?: string
    county?: string
    postcode?: string
    ldu?: string
    telephoneNumber?: string
  }
  rescheduled?: boolean
  rescheduledStaff?: boolean
  rescheduledPop?: boolean
  didTheyComply?: boolean
  absentWaitingEvidence?: boolean
  enforcementAction?: {
    responseByDate: string
  }
  rearrangeOrCancelReason?: string
  rescheduledBy?: {
    forename: string
    middleName?: string
    surname: string
    username?: string
  }
  repeating?: boolean
  nonComplianceReason?: string
  documents?: Array<Document>
  isRarRelated?: boolean
  rarCategory?: string
  acceptableAbsence?: boolean
  acceptableAbsenceReason?: string
  isAppointment?: boolean
  isCommunication?: boolean
  action?: string
  isSystemContact?: boolean
  isEmailOrTextFromPop?: boolean
  isPhoneCallFromPop?: boolean
  isEmailOrTextToPop?: boolean
  isPhoneCallToPop?: boolean
  isInPast?: boolean
  isPastAppointment?: boolean
  countsTowardsRAR?: boolean
  lastUpdated?: string
  lastUpdatedBy?: {
    forename: string
    middleName?: string
    surname: string
    username?: string
  }
  description?: string
  outcome?: string
  deliusManaged?: boolean
  isVisor?: boolean
  eventId?: number
  component?: {
    id?: number
    description?: string
    type?: string
  }
  nsiId?: number
  esupervisionId?: string
  externalReference?: string
  isUpdatableContact?: boolean
}

type Note = {
  id: number
  createdBy?: string
  createdByDate?: string
  note: string
  hasNoteBeenTruncated?: boolean
}

type Document = {
  id: string
  name: string
  lastUpdated?: string
  createdAt?: string
}
