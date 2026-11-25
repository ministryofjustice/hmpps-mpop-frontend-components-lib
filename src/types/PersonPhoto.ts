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
