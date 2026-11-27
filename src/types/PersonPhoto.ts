import type { Readable } from 'stream'
import type { ApiResponse } from './ApiResponse'

export type PersonPhotoResponse = ApiResponse & {
  photo: Readable | null
}

export type CheckInPhotoUrlResponse = ApiResponse & {
  photoUrl: string | null
}

export type PersonPhotoAvailability = ApiResponse & {
  hasPhoto: boolean
}

export type CheckInPhoto = {
  photoUrl: string | null
  failed: boolean
}

export type PersonHeaderPhotoOptions = {
  crn: string
  noms?: string | null
  prisonPhotoHref?: (noms: string) => string
  includeCheckInPhoto?: boolean
  checkInPhoto?: CheckInPhoto
  hasPrisonPhoto?: boolean
}

export type PersonHeaderPhoto = {
  photo?: string
  photoUnavailable: boolean
  checkInPhoto?: CheckInPhoto
  hasPrisonPhoto?: boolean
}

export interface PersonPhotoHttpResponse extends NodeJS.WritableStream {
  set(field: string, value: string): unknown
  removeHeader(name: string): void
  type(type: string): unknown
  sendStatus(code: number): unknown
}
